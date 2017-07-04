import json
import pymysql
import math
import time

levelRange = range(1,6)
gridPerUnit = 100

#==========================================================
def InsertPointSource(filename, skip):
    print("Insert point source started")
    startTime = time.time()
    
    field = "SERIAL_NO, DICT_NO, C_NO, SCC, NO_P, FC,\
    TSP_EMI, PM_EMI, PM6_EMI, PM25_EMI, SOX_EMI, NOX_EMI, THC_EMI, NMHC_EMI, CO_EMI, PB_EMI,\
    COMP_KIND1, WGS84_E, WGS84_N, ORI_QU1, DIA, HEI, TEMP, VEL,\
    ASSUME_Q, ASSUME_D, ASSUME_H, ASSUME_T, ASSUME_V,\
    NO_S, ASSUME_HD, HD1, ASSUME_DW, DW1, ASSUME_WY, WY1,\
    F_N1, F_Q1, UNIT, U_NAME, S1, A1,\
    EQ_1, A_NAME1, EQ_2, A_NAME2, EQ_3, A_NAME3, EQ_4, A_NAME4, EQ_5, A_NAME5,\
    TSP_EFF, SOX_EFF, NOX_EFF, THC_EFF, CO_EFF, PB_EFF,\
    ID_AREA, COMP_NAM, ZS, TSP_RANK, SOX_RANK, NOX_RANK, VOC_RANK, CO_RANK, PB_RANK"

    groupData = {}
    levelData = {}
    for i in levelRange:
        levelData[i] = {}

    for line in open(filename,errors="ignore"):
        #去掉最後面的\n再依,分開成陣列
        arr = line[0:-1].split(",")
        #print(arr)
        
        #略過第一列
        if "SERIAL_NO" in arr[0]:
            continue
        
        if(int(arr[0]) < skip):
            continue
        
        val = ""
        n = len(arr)
        for i in range(0,n):
            #略過空白欄位
            if i in [20,22,24,26,57]:
                continue
            
            #無數值的欄位給null
            if arr[i] == "":
                val+="null"
            else:
                #數字
                if i in [0,6,7,8,9,10,11,12,13,14,15,17,18,19,21,23,25,27,35,37,39,56,58,59,60,61,62,65]:
                    val+=arr[i]
                else:   #字串
                    val+="'"+arr[i]+"'"
            if i < n-1:
                val+=","

        with connection.cursor() as cursor:
            sql = "INSERT INTO PointSources ("+field+") VALUES ("+val+")"
            #print(sql)
            cursor.execute(sql)

        #print("insert data"+arr[0])
        connection.commit()

        #==========group data (依座標分群)=========
        pos = arr[17]+","+arr[18]
        if pos in groupData:
            data = groupData[pos]
            data["TSP_EMI"] += float(arr[6])
            data["PM_EMI"] += float(arr[7])
            data["PM6_EMI"] += float(arr[8])
            data["PM25_EMI"] += float(arr[9])
            data["SOX_EMI"] += float(arr[10])
            data["NOX_EMI"] += float(arr[11])
            data["THC_EMI"] += float(arr[12])
            data["NMHC_EMI"] += float(arr[13])
            data["CO_EMI"] += float(arr[14])
            data["PB_EMI"] += float(arr[15])
        else:
            data = {}
            data["WGS84_E"] = float(arr[17])
            data["WGS84_N"] = float(arr[18])
            data["TSP_EMI"] = float(arr[6])
            data["PM_EMI"] = float(arr[7])
            data["PM6_EMI"] = float(arr[8])
            data["PM25_EMI"] = float(arr[9])
            data["SOX_EMI"] = float(arr[10])
            data["NOX_EMI"] = float(arr[11])
            data["THC_EMI"] = float(arr[12])
            data["NMHC_EMI"] = float(arr[13])
            data["CO_EMI"] = float(arr[14])
            data["PB_EMI"] = float(arr[15])
            groupData[pos] = data

        #=========先在memory加總，最後再一起存進db=========
        for level in levelRange:
            scale = gridPerUnit/pow(2,level);
            gridX = math.floor(float(arr[17])*scale);
            gridY = math.floor(float(arr[18])*scale);
            id = str(level)+"_"+str(gridX)+"_"+str(gridY)

            if id in levelData[level]:
                data = levelData[level][id]
                data["TSP_EMI"] += float(arr[6])
                data["PM_EMI"] += float(arr[7])
                data["PM6_EMI"] += float(arr[8])
                data["PM25_EMI"] += float(arr[9])
                data["SOX_EMI"] += float(arr[10])
                data["NOX_EMI"] += float(arr[11])
                data["THC_EMI"] += float(arr[12])
                data["NMHC_EMI"] += float(arr[13])
                data["CO_EMI"] += float(arr[14])
                data["PB_EMI"] += float(arr[15])
            else:
                data = {}
                data["GRID_X"] = gridX
                data["GRID_Y"] = gridY
                data["TSP_EMI"] = float(arr[6])
                data["PM_EMI"] = float(arr[7])
                data["PM6_EMI"] = float(arr[8])
                data["PM25_EMI"] = float(arr[9])
                data["SOX_EMI"] = float(arr[10])
                data["NOX_EMI"] = float(arr[11])
                data["THC_EMI"] = float(arr[12])
                data["NMHC_EMI"] = float(arr[13])
                data["CO_EMI"] = float(arr[14])
                data["PB_EMI"] = float(arr[15])
                levelData[level][id] = data
                
    elapseTime = time.time() - startTime
    print("Insert point source finished in "+str(elapseTime)+" s")

    #==========add group to db========
    print("Insert point group started")
    startTime = time.time()

    groupField = "WGS84_E, WGS84_N, TSP_EMI, PM_EMI, PM6_EMI, PM25_EMI,\
    SOX_EMI, NOX_EMI, THC_EMI, NMHC_EMI, CO_EMI, PB_EMI"

    print("群組數: "+str(len(groupData.keys())))
    for key in groupData:
        data = groupData[key]
        groupVal = str(data["WGS84_E"])+","+str(data["WGS84_N"])+","

        with connection.cursor() as cursor:
            groupVal += str(data["TSP_EMI"])+","
            groupVal += str(data["PM_EMI"])+","
            groupVal += str(data["PM6_EMI"])+","
            groupVal += str(data["PM25_EMI"])+","
            groupVal += str(data["SOX_EMI"])+","
            groupVal += str(data["NOX_EMI"])+","
            groupVal += str(data["THC_EMI"])+","
            groupVal += str(data["NMHC_EMI"])+","
            groupVal += str(data["CO_EMI"])+","
            groupVal += str(data["PB_EMI"])
            
            sql = "INSERT INTO PointGroups ("+groupField+") VALUES ("+groupVal+")"
            #print(sql)
            cursor.execute(sql)

        connection.commit()
            
    elapseTime = time.time() - startTime
    print("Insert point group finished in "+str(elapseTime)+" s")
    
    
    #==========add grid to db===========
    print("Insert point grids started")
    startTime = time.time()
    
    levelField = "LEVEL, GRID_X, GRID_Y, TSP_EMI, PM_EMI, PM6_EMI, PM25_EMI,\
    SOX_EMI, NOX_EMI, THC_EMI, NMHC_EMI, CO_EMI, PB_EMI"
    for level in levelRange:
        print("Level "+str(level)+": 網格數: "+str(len(levelData[level].keys())))
        for key in levelData[level]:
            data = levelData[level][key]
            levelVal = str(level)+","+str(data["GRID_X"])+","+str(data["GRID_Y"])+","

            with connection.cursor() as cursor:
                levelVal += str(data["TSP_EMI"])+","
                levelVal += str(data["PM_EMI"])+","
                levelVal += str(data["PM6_EMI"])+","
                levelVal += str(data["PM25_EMI"])+","
                levelVal += str(data["SOX_EMI"])+","
                levelVal += str(data["NOX_EMI"])+","
                levelVal += str(data["THC_EMI"])+","
                levelVal += str(data["NMHC_EMI"])+","
                levelVal += str(data["CO_EMI"])+","
                levelVal += str(data["PB_EMI"])
                
                sql = "INSERT INTO PointGrids ("+levelField+") VALUES ("+levelVal+")"
                #print(sql)
                cursor.execute(sql)

            connection.commit()
            
        
    elapseTime = time.time() - startTime
    print("Insert point grid finished in "+str(elapseTime)+" s")


#==========================================================
def InsertLineSource(filename, skip):
    print("Insert line source started")
    startTime = time.time()
    
    field = "SERIAL_NO, NSC, NSC_SUB, WGS84_E, WGS84_N, DICT,\
    EM_TSP, EM_PM, EM_PM6, EM_PM25, EM_SOX, EM_NOX,\
    EM_THC, EM_NMHC, EM_EXHC, EM_EHC, EM_RHC, EM_RST,\
    EM_CO, EM_PB, EM_NH3"

    groupData = {}
    levelData = {}
    for i in levelRange:
        levelData[i] = {}

    serialNo= 0;
    for line in open(filename,errors="ignore"):
        #去掉最後面的\n再依,分開成陣列
        arr = line[0:-1].split(",")
        #print(arr)
        
        #略過第一列
        if "NSC" in arr[0]:
            continue

        serialNo += 1
        if(serialNo < skip):
            continue
        val = str(serialNo) + ","
        n = len(arr)
        for i in range(0,n):
            #無數值的欄位給null
            if arr[i] == "":
                val+="null"
            else:
                if i in [0,1,4]:    #字串
                    val+="'"+arr[i]+"'"
                else:   #數字
                    val+=arr[i]
            if i < n-1:
                val+=","

        with connection.cursor() as cursor:
            sql = "INSERT INTO LineSources ("+field+") VALUES ("+val+")"
            #print(sql)
            cursor.execute(sql)

        #print("insert data"+str(serialNo))
        connection.commit()

        #==========group data (依座標分群)=========
        pos = arr[2]+","+arr[3]
        if pos in groupData:
            data = groupData[pos]
            data["EM_TSP"] += float(arr[5])
            data["EM_PM"] += float(arr[6])
            data["EM_PM6"] += float(arr[7])
            data["EM_PM25"] += float(arr[8])
            data["EM_SOX"] += float(arr[9])
            data["EM_NOX"] += float(arr[10])
            data["EM_THC"] += float(arr[11])
            data["EM_NMHC"] += float(arr[12])
            data["EM_EXHC"] += float(arr[13])
            data["EM_EHC"] += float(arr[14])
            data["EM_RHC"] += float(arr[15])
            data["EM_RST"] += float(arr[16])
            data["EM_CO"] += float(arr[17])
            data["EM_PB"] += float(arr[18])
            data["EM_NH3"] += float(arr[19])
        else:
            data = {}
            data["WGS84_E"] = float(arr[2])
            data["WGS84_N"] = float(arr[3])
            data["EM_TSP"] = float(arr[5])
            data["EM_PM"] = float(arr[6])
            data["EM_PM6"] = float(arr[7])
            data["EM_PM25"] = float(arr[8])
            data["EM_SOX"] = float(arr[9])
            data["EM_NOX"] = float(arr[10])
            data["EM_THC"] = float(arr[11])
            data["EM_NMHC"] = float(arr[12])
            data["EM_EXHC"] = float(arr[13])
            data["EM_EHC"] = float(arr[14])
            data["EM_RHC"] = float(arr[15])
            data["EM_RST"] = float(arr[16])
            data["EM_CO"] = float(arr[17])
            data["EM_PB"] = float(arr[18])
            data["EM_NH3"] = float(arr[19])
            groupData[pos] = data

        #===========先在memory加總，最後再一起存進db=========
        for level in levelRange:
            scale = gridPerUnit/pow(2,level);
            gridX = math.floor(float(arr[2])*scale);
            gridY = math.floor(float(arr[3])*scale);
            id = str(level)+"_"+str(gridX)+"_"+str(gridY)

            if id in levelData[level]:
                data = levelData[level][id]
                data["EM_TSP"] += float(arr[5])
                data["EM_PM"] += float(arr[6])
                data["EM_PM6"] += float(arr[7])
                data["EM_PM25"] += float(arr[8])
                data["EM_SOX"] += float(arr[9])
                data["EM_NOX"] += float(arr[10])
                data["EM_THC"] += float(arr[11])
                data["EM_NMHC"] += float(arr[12])
                data["EM_EXHC"] += float(arr[13])
                data["EM_EHC"] += float(arr[14])
                data["EM_RHC"] += float(arr[15])
                data["EM_RST"] += float(arr[16])
                data["EM_CO"] += float(arr[17])
                data["EM_PB"] += float(arr[18])
                data["EM_NH3"] += float(arr[19])
            else:
                data = {}
                data["GRID_X"] = gridX
                data["GRID_Y"] = gridY
                data["EM_TSP"] = float(arr[5])
                data["EM_PM"] = float(arr[6])
                data["EM_PM6"] = float(arr[7])
                data["EM_PM25"] = float(arr[8])
                data["EM_SOX"] = float(arr[9])
                data["EM_NOX"] = float(arr[10])
                data["EM_THC"] = float(arr[11])
                data["EM_NMHC"] = float(arr[12])
                data["EM_EXHC"] = float(arr[13])
                data["EM_EHC"] = float(arr[14])
                data["EM_RHC"] = float(arr[15])
                data["EM_RST"] = float(arr[16])
                data["EM_CO"] = float(arr[17])
                data["EM_PB"] = float(arr[18])
                data["EM_NH3"] = float(arr[19])
                levelData[level][id] = data
                
    elapseTime = time.time() - startTime
    print("Insert line source finished in "+str(elapseTime)+" s")

    #==========add group to db========
    print("Insert line group started")
    startTime = time.time()

    groupField = "WGS84_E, WGS84_N, EM_TSP, EM_PM, EM_PM6, EM_PM25, EM_SOX,\
        EM_NOX, EM_THC, EM_NMHC, EM_EXHC, EM_EHC, EM_RHC, EM_RST, EM_CO, EM_PB, EM_NH3"

    print("群組數: "+str(len(groupData.keys())))
    for key in groupData:
        data = groupData[key]
        groupVal = str(data["WGS84_E"])+","+str(data["WGS84_N"])+","

        with connection.cursor() as cursor:
            groupVal += str(data["EM_TSP"])+","
            groupVal += str(data["EM_PM"])+","
            groupVal += str(data["EM_PM6"])+","
            groupVal += str(data["EM_PM25"])+","
            groupVal += str(data["EM_SOX"])+","
            groupVal += str(data["EM_NOX"])+","
            groupVal += str(data["EM_THC"])+","
            groupVal += str(data["EM_NMHC"])+","
            groupVal += str(data["EM_EXHC"])+","
            groupVal += str(data["EM_EHC"])+","
            groupVal += str(data["EM_RHC"])+","
            groupVal += str(data["EM_RST"])+","
            groupVal += str(data["EM_CO"])+","
            groupVal += str(data["EM_PB"])+","
            groupVal += str(data["EM_NH3"])
            
            sql = "INSERT INTO LineGroups ("+groupField+") VALUES ("+groupVal+")"
            #print(sql)
            cursor.execute(sql)

        connection.commit()
            
    elapseTime = time.time() - startTime
    print("Insert line group finished in "+str(elapseTime)+" s")
    
    #==========add grid to db===========
    print("Insert line grids started")
    startTime = time.time()
    
    levelField = "LEVEL, GRID_X, GRID_Y, EM_TSP, EM_PM, EM_PM6, EM_PM25, EM_SOX,\
        EM_NOX, EM_THC, EM_NMHC, EM_EXHC, EM_EHC, EM_RHC, EM_RST, EM_CO, EM_PB, EM_NH3"
    for level in levelRange:
        print("Level "+str(level)+": 網格數: "+str(len(levelData[level].keys())))
        for key in levelData[level]:
            data = levelData[level][key]
            levelVal = str(level)+","+str(data["GRID_X"])+","+str(data["GRID_Y"])+","

            with connection.cursor() as cursor:
                levelVal += str(data["EM_TSP"])+","
                levelVal += str(data["EM_PM"])+","
                levelVal += str(data["EM_PM6"])+","
                levelVal += str(data["EM_PM25"])+","
                levelVal += str(data["EM_SOX"])+","
                levelVal += str(data["EM_NOX"])+","
                levelVal += str(data["EM_THC"])+","
                levelVal += str(data["EM_NMHC"])+","
                levelVal += str(data["EM_EXHC"])+","
                levelVal += str(data["EM_EHC"])+","
                levelVal += str(data["EM_RHC"])+","
                levelVal += str(data["EM_RST"])+","
                levelVal += str(data["EM_CO"])+","
                levelVal += str(data["EM_PB"])+","
                levelVal += str(data["EM_NH3"])
                
                sql = "INSERT INTO LineGrids ("+levelField+") VALUES ("+levelVal+")"
                #print(sql)
                cursor.execute(sql)

            connection.commit()
            
        
    elapseTime = time.time() - startTime
    print("Insert line grid finished in "+str(elapseTime)+" s")


#==========================================================
def InsertAreaSource(filename, skip):
    print("Insert area source started")
    startTime = time.time()
    
    field = "SERIAL_NO, NSC, NSC_SUB, WGS84_E, WGS84_N, DICT,\
    EM_TSP, EM_PM, EM_PM6, EM_PM25, EM_SOX, EM_NOX,\
    EM_THC, EM_NMHC,EM_CO, EM_PB, EM_NH3"

    groupData = {}
    levelData = {}
    for i in levelRange:
        levelData[i] = {}

    serialNo= 0;
    for line in open(filename,errors="ignore"):
        #去掉最後面的\n再依,分開成陣列
        arr = line[0:-1].split(",")
        #print(arr)
        
        #略過第一列
        if "NSC" in arr[0]:
            continue

        serialNo += 1
        if(serialNo < skip):
            continue
        val = str(serialNo) + ","
        n = len(arr)
        for i in range(0,n):
            #無數值的欄位給null
            if arr[i] == "":
                val+="null"
            else:
                if i in [0,1,4]:    #字串
                    val+="'"+arr[i]+"'"
                else:   #數字
                    val+=arr[i]
            if i < n-1:
                val+=","

        with connection.cursor() as cursor:
            sql = "INSERT INTO AreaSources ("+field+") VALUES ("+val+")"
            #print(sql)
            cursor.execute(sql)

        #print("insert data"+str(serialNo))
        connection.commit()

        #==========group data (依座標分群)=========
        pos = arr[2]+","+arr[3]
        if pos in groupData:
            data = groupData[pos]
            data["EM_TSP"] += float(arr[5])
            data["EM_PM"] += float(arr[6])
            data["EM_PM6"] += float(arr[7])
            data["EM_PM25"] += float(arr[8])
            data["EM_SOX"] += float(arr[9])
            data["EM_NOX"] += float(arr[10])
            data["EM_THC"] += float(arr[11])
            data["EM_NMHC"] += float(arr[12])
            data["EM_CO"] += float(arr[13])
            data["EM_PB"] += float(arr[14])
            data["EM_NH3"] += float(arr[15])
        else:
            data = {}
            data["WGS84_E"] = float(arr[2])
            data["WGS84_N"] = float(arr[3])
            data["EM_TSP"] = float(arr[5])
            data["EM_PM"] = float(arr[6])
            data["EM_PM6"] = float(arr[7])
            data["EM_PM25"] = float(arr[8])
            data["EM_SOX"] = float(arr[9])
            data["EM_NOX"] = float(arr[10])
            data["EM_THC"] = float(arr[11])
            data["EM_NMHC"] = float(arr[12])
            data["EM_CO"] = float(arr[13])
            data["EM_PB"] = float(arr[14])
            data["EM_NH3"] = float(arr[15])
            groupData[pos] = data
            
        #=======先在memory加總，最後再一起存進db=======
        for level in levelRange:
            scale = gridPerUnit/pow(2,level);
            gridX = math.floor(float(arr[2])*scale);
            gridY = math.floor(float(arr[3])*scale);
            id = str(level)+"_"+str(gridX)+"_"+str(gridY)

            if id in levelData[level]:
                data = levelData[level][id]
                data["EM_TSP"] += float(arr[5])
                data["EM_PM"] += float(arr[6])
                data["EM_PM6"] += float(arr[7])
                data["EM_PM25"] += float(arr[8])
                data["EM_SOX"] += float(arr[9])
                data["EM_NOX"] += float(arr[10])
                data["EM_THC"] += float(arr[11])
                data["EM_NMHC"] += float(arr[12])
                data["EM_CO"] += float(arr[13])
                data["EM_PB"] += float(arr[14])
                data["EM_NH3"] += float(arr[15])
            else:
                data = {}
                data["GRID_X"] = gridX
                data["GRID_Y"] = gridY
                data["EM_TSP"] = float(arr[5])
                data["EM_PM"] = float(arr[6])
                data["EM_PM6"] = float(arr[7])
                data["EM_PM25"] = float(arr[8])
                data["EM_SOX"] = float(arr[9])
                data["EM_NOX"] = float(arr[10])
                data["EM_THC"] = float(arr[11])
                data["EM_NMHC"] = float(arr[12])
                data["EM_CO"] = float(arr[13])
                data["EM_PB"] = float(arr[14])
                data["EM_NH3"] = float(arr[15])
                levelData[level][id] = data
                
    elapseTime = time.time() - startTime
    print("Insert area source finished in "+str(elapseTime)+" s")

    #==========add group to db========
    print("Insert area group started")
    startTime = time.time()

    groupField = "WGS84_E, WGS84_N, EM_TSP, EM_PM, EM_PM6, EM_PM25, EM_SOX,\
        EM_NOX, EM_THC, EM_NMHC, EM_CO, EM_PB, EM_NH3"

    print("群組數: "+str(len(groupData.keys())))
    for key in groupData:
        data = groupData[key]
        groupVal = str(data["WGS84_E"])+","+str(data["WGS84_N"])+","

        with connection.cursor() as cursor:
            groupVal += str(data["EM_TSP"])+","
            groupVal += str(data["EM_PM"])+","
            groupVal += str(data["EM_PM6"])+","
            groupVal += str(data["EM_PM25"])+","
            groupVal += str(data["EM_SOX"])+","
            groupVal += str(data["EM_NOX"])+","
            groupVal += str(data["EM_THC"])+","
            groupVal += str(data["EM_NMHC"])+","
            groupVal += str(data["EM_CO"])+","
            groupVal += str(data["EM_PB"])+","
            groupVal += str(data["EM_NH3"])
            
            sql = "INSERT INTO AreaGroups ("+groupField+") VALUES ("+groupVal+")"
            #print(sql)
            cursor.execute(sql)

        connection.commit()
            
    elapseTime = time.time() - startTime
    print("Insert area group finished in "+str(elapseTime)+" s")
    
    #===========add grid to db==========
    print("Insert area grids started")
    startTime = time.time()
    
    levelField = "LEVEL, GRID_X, GRID_Y, EM_TSP, EM_PM, EM_PM6, EM_PM25, EM_SOX,\
        EM_NOX, EM_THC, EM_NMHC, EM_CO, EM_PB, EM_NH3"
    for level in levelRange:
        print("Level "+str(level)+": 網格數: "+str(len(levelData[level].keys())))
        for key in levelData[level]:
            data = levelData[level][key]
            levelVal = str(level)+","+str(data["GRID_X"])+","+str(data["GRID_Y"])+","

            with connection.cursor() as cursor:
                levelVal += str(data["EM_TSP"])+","
                levelVal += str(data["EM_PM"])+","
                levelVal += str(data["EM_PM6"])+","
                levelVal += str(data["EM_PM25"])+","
                levelVal += str(data["EM_SOX"])+","
                levelVal += str(data["EM_NOX"])+","
                levelVal += str(data["EM_THC"])+","
                levelVal += str(data["EM_NMHC"])+","
                levelVal += str(data["EM_CO"])+","
                levelVal += str(data["EM_PB"])+","
                levelVal += str(data["EM_NH3"])
                
                sql = "INSERT INTO AreaGrids ("+levelField+") VALUES ("+levelVal+")"
                #print(sql)
                cursor.execute(sql)

            connection.commit()
            
        
    elapseTime = time.time() - startTime
    print("Insert area grid finished in "+str(elapseTime)+" s")


#==========================================================
def InsertBioSource(filename, skip):
    print("Insert bio source started")
    startTime = time.time()
    
    field = "SERIAL_NO,WGS84_E, WGS84_N,\
    TOTAL_NMHC, ISO, MONO, ONMHC, MBO"

    groupData = {}
    levelData = {}
    for i in levelRange:
        levelData[i] = {}

    serialNo= 0;
    for line in open(filename,errors="ignore"):
        #去掉最後面的\n再依,分開成陣列
        arr = line[0:-1].split(",")
        #print(arr)
        
        #略過第一列
        if "WGS84_E" in arr[0]:
            continue

        serialNo += 1
        if(serialNo < skip):
            continue
        val = str(serialNo) + ","
        n = len(arr)
        for i in range(0,n):
            #無數值的欄位給null
            if arr[i] == "":
                val+="null"
            else:
                val+=arr[i]
            if i < n-1:
                val+=","

        with connection.cursor() as cursor:
            sql = "INSERT INTO BioSources ("+field+") VALUES ("+val+")"
            #print(sql)
            cursor.execute(sql)

        #print("insert data"+str(serialNo))
        connection.commit()

        #==========group data (依座標分群)=========
        pos = arr[0]+","+arr[1]
        if pos in groupData:
            data = groupData[pos]
            data["TOTAL_NMHC"] += float(arr[2])
            data["ISO"] += float(arr[3])
            data["MONO"] += float(arr[4])
            data["ONMHC"] += float(arr[5])
            data["MBO"] += float(arr[6])
        else:
            data = {}
            data["WGS84_E"] = float(arr[0])
            data["WGS84_N"] = float(arr[1])
            data["TOTAL_NMHC"] = float(arr[2])
            data["ISO"] = float(arr[3])
            data["MONO"] = float(arr[4])
            data["ONMHC"] = float(arr[5])
            data["MBO"] = float(arr[6])
            groupData[pos] = data
            
        #==========先在memory加總，最後再一起存進db==========
        for level in levelRange:
            scale = gridPerUnit/pow(2,level);
            gridX = math.floor(float(arr[0])*scale);
            gridY = math.floor(float(arr[1])*scale);
            id = str(level)+"_"+str(gridX)+"_"+str(gridY)

            if id in levelData[level]:
                data = levelData[level][id]
                data["TOTAL_NMHC"] += float(arr[2])
                data["ISO"] += float(arr[3])
                data["MONO"] += float(arr[4])
                data["ONMHC"] += float(arr[5])
                data["MBO"] += float(arr[6])
            else:
                data = {}
                data["GRID_X"] = gridX
                data["GRID_Y"] = gridY
                data["TOTAL_NMHC"] = float(arr[2])
                data["ISO"] = float(arr[3])
                data["MONO"] = float(arr[4])
                data["ONMHC"] = float(arr[5])
                data["MBO"] = float(arr[6])
                levelData[level][id] = data
                
    elapseTime = time.time() - startTime
    print("Insert bio source finished in "+str(elapseTime)+" s")

    #==========add group to db========
    print("Insert bio group started")
    startTime = time.time()

    groupField = "WGS84_E, WGS84_N, TOTAL_NMHC, ISO, MONO, ONMHC, MBO"

    print("群組數: "+str(len(groupData.keys())))
    for key in groupData:
        data = groupData[key]
        groupVal = str(data["WGS84_E"])+","+str(data["WGS84_N"])+","

        with connection.cursor() as cursor:
            groupVal += str(data["TOTAL_NMHC"])+","
            groupVal += str(data["ISO"])+","
            groupVal += str(data["MONO"])+","
            groupVal += str(data["ONMHC"])+","
            groupVal += str(data["MBO"])
            
            sql = "INSERT INTO BioGroups ("+groupField+") VALUES ("+groupVal+")"
            #print(sql)
            cursor.execute(sql)

        connection.commit()
            
    elapseTime = time.time() - startTime
    print("Insert bio group finished in "+str(elapseTime)+" s")
    
    #===========add grid to db==========
    print("Insert bio grids started")
    startTime = time.time()
    
    levelField = "LEVEL, GRID_X, GRID_Y, TOTAL_NMHC, ISO, MONO, ONMHC, MBO"
    for level in levelRange:
        print("Level "+str(level)+": 網格數: "+str(len(levelData[level].keys())))
        for key in levelData[level]:
            data = levelData[level][key]
            levelVal = str(level)+","+str(data["GRID_X"])+","+str(data["GRID_Y"])+","

            with connection.cursor() as cursor:
                levelVal += str(data["TOTAL_NMHC"])+","
                levelVal += str(data["ISO"])+","
                levelVal += str(data["MONO"])+","
                levelVal += str(data["ONMHC"])+","
                levelVal += str(data["MBO"])
                
                sql = "INSERT INTO BioGrids ("+levelField+") VALUES ("+levelVal+")"
                #print(sql)
                cursor.execute(sql)

            connection.commit()
            
        
    elapseTime = time.time() - startTime
    print("Insert bio grid finished in "+str(elapseTime)+" s")


#==========================================================
def InsertNH3Source(filename, skip):
    print("Insert NH3 source started")
    startTime = time.time()
    
    field = "SERIAL_NO, NSC, NSC_SUB, WGS84_E, WGS84_N, DICT, EM_NH3"

    groupData = {}
    levelData = {}
    for i in levelRange:
        levelData[i] = {}

    serialNo= 0;
    for line in open(filename,errors="ignore"):
        #去掉最後面的\n再依,分開成陣列
        arr = line[0:-1].split(",")
        #print(arr)
        
        #略過第一列
        if "NSC" in arr[0]:
            continue

        serialNo += 1
        if(serialNo < skip):
            continue
        val = str(serialNo) + ","
        n = len(arr)
        for i in range(0,n):
            #無數值的欄位給null
            if arr[i] == "":
                val+="null"
            else:
                if i in [0,1,4]:    #字串
                    val+="'"+arr[i]+"'"
                else:   #數字
                    val+=arr[i]
            if i < n-1:
                val+=","

        with connection.cursor() as cursor:
            sql = "INSERT INTO NH3Sources ("+field+") VALUES ("+val+")"
            #print(sql)
            cursor.execute(sql)

        #print("insert data"+str(serialNo))
        connection.commit()

        #==========group data (依座標分群)=========
        pos = arr[2]+","+arr[3]
        if pos in groupData:
            data = groupData[pos]
            data["EM_NH3"] += float(arr[5])
        else:
            data = {}
            data["WGS84_E"] = float(arr[2])
            data["WGS84_N"] = float(arr[3])
            data["EM_NH3"] = float(arr[5])
            groupData[pos] = data
            
        #===========先在memory加總，最後再一起存進db==========
        for level in levelRange:
            scale = gridPerUnit/pow(2,level);
            gridX = math.floor(float(arr[2])*scale);
            gridY = math.floor(float(arr[3])*scale);
            id = str(level)+"_"+str(gridX)+"_"+str(gridY)

            if id in levelData[level]:
                data = levelData[level][id]
                data["EM_NH3"] += float(arr[5])
                
            else:
                data = {}
                data["GRID_X"] = gridX
                data["GRID_Y"] = gridY
                data["EM_NH3"] = float(arr[5])
                levelData[level][id] = data
                
    elapseTime = time.time() - startTime
    print("Insert NH3 source finished in "+str(elapseTime)+" s")

    #==========add group to db========
    print("Insert nh3 group started")
    startTime = time.time()

    groupField = "WGS84_E, WGS84_N, EM_NH3"

    print("群組數: "+str(len(groupData.keys())))
    for key in groupData:
        data = groupData[key]
        groupVal = str(data["WGS84_E"])+","+str(data["WGS84_N"])+","

        with connection.cursor() as cursor:
            groupVal += str(data["EM_NH3"])
            
            sql = "INSERT INTO NH3Groups ("+groupField+") VALUES ("+groupVal+")"
            #print(sql)
            cursor.execute(sql)

        connection.commit()
            
    elapseTime = time.time() - startTime
    print("Insert nh3 group finished in "+str(elapseTime)+" s")
    
    #==========add grid to db==========
    print("Insert NH3 grids started")
    startTime = time.time()
    
    levelField = "LEVEL, GRID_X, GRID_Y, EM_NH3"
    for level in levelRange:
        print("Level "+str(level)+": 網格數: "+str(len(levelData[level].keys())))
        for key in levelData[level]:
            data = levelData[level][key]
            levelVal = str(level)+","+str(data["GRID_X"])+","+str(data["GRID_Y"])+","

            with connection.cursor() as cursor:
                levelVal += str(data["EM_NH3"])
                
                sql = "INSERT INTO NH3Grids ("+levelField+") VALUES ("+levelVal+")"
                #print(sql)
                cursor.execute(sql)

            connection.commit()
            
        
    elapseTime = time.time() - startTime
    print("Insert NH3 grid finished in "+str(elapseTime)+" s")

#==========================sum all source=============================
class SumData:
    def __init__(self, gridX, gridY):
        self.GRID_X = gridX
        self.GRID_Y = gridY
        self.TSP = {'POINT':0, 'LINE':0, 'AREA':0}
        self.PM = {'POINT':0, 'LINE':0, 'AREA':0}
        self.PM6 = {'POINT':0, 'LINE':0, 'AREA':0}
        self.PM25 = {'POINT':0, 'LINE':0, 'AREA':0}
        self.SOX = {'POINT':0, 'LINE':0, 'AREA':0}
        self.NOX = {'POINT':0, 'LINE':0, 'AREA':0}
        self.THC = {'POINT':0, 'LINE':0, 'AREA':0}
        self.NMHC = {'POINT':0, 'LINE':0, 'AREA':0}
        self.CO = {'POINT':0, 'LINE':0, 'AREA':0}
        self.PB = {'POINT':0, 'LINE':0, 'AREA':0}
    def GetTSP(self):
        return self.TSP["POINT"]+self.TSP["LINE"]+self.TSP["AREA"]
    def GetPM(self):
        return self.PM["POINT"]+self.PM["LINE"]+self.PM["AREA"]
    def GetPM6(self):
        return self.PM6["POINT"]+self.PM6["LINE"]+self.PM6["AREA"]
    def GetPM25(self):
        return self.PM25["POINT"]+self.PM25["LINE"]+self.PM25["AREA"]
    def GetSOX(self):
        return self.SOX["POINT"]+self.SOX["LINE"]+self.SOX["AREA"]
    def GetNOX(self):
        return self.NOX["POINT"]+self.NOX["LINE"]+self.NOX["AREA"]
    def GetTHC(self):
        return self.THC["POINT"]+self.THC["LINE"]+self.THC["AREA"]
    def GetNMHC(self):
        return self.NMHC["POINT"]+self.NMHC["LINE"]+self.NMHC["AREA"]
    def GetCO(self):
        return self.CO["POINT"]+self.CO["LINE"]+self.CO["AREA"]
    def GetPB(self):
        return self.PB["POINT"]+self.PB["LINE"]+self.PB["AREA"]

def SumAllSource(pointFile, lineFile, areaFile):
    print("Sum all sources started")
    startTime = time.time()

    levelData = {}
    levelArr = [0]+list(levelRange)
    for i in levelArr:
        levelData[i] = {}

    #============point source===========
    for line in open(pointFile,errors="ignore"):
        source = "POINT"
        #去掉最後面的\n再依,分開成陣列
        arr = line[0:-1].split(",")
        
        #略過第一列
        if "SERIAL_NO" in arr[0]:
            continue
            
        for level in levelArr:
            scale = gridPerUnit/pow(2,level);
            gridX = math.floor(float(arr[17])*scale);
            gridY = math.floor(float(arr[18])*scale);
            id = str(level)+"_"+str(gridX)+"_"+str(gridY)

            if id in levelData[level]:
                data = levelData[level][id]
                data.TSP[source] += float(arr[6])
                data.PM[source] += float(arr[7])
                data.PM6[source] += float(arr[8])
                data.PM25[source] += float(arr[9])
                data.SOX[source] += float(arr[10])
                data.NOX[source] += float(arr[11])
                data.THC[source] += float(arr[12])
                data.NMHC[source] += float(arr[13])
                data.CO[source] += float(arr[14])
                data.PB[source] += float(arr[15])
            else:
                data = SumData(gridX, gridY)
                data.TSP[source] += float(arr[6])
                data.PM[source] += float(arr[7])
                data.PM6[source] += float(arr[8])
                data.PM25[source] += float(arr[9])
                data.SOX[source] += float(arr[10])
                data.NOX[source] += float(arr[11])
                data.THC[source] += float(arr[12])
                data.NMHC[source] += float(arr[13])
                data.CO[source] += float(arr[14])
                data.PB[source] += float(arr[15])
                levelData[level][id] = data

    #============line source===========
    for line in open(lineFile,errors="ignore"):
        source = "LINE"
        #去掉最後面的\n再依,分開成陣列
        arr = line[0:-1].split(",")
        
        #略過第一列
        if "NSC" in arr[0]:
            continue
                
        for level in levelArr:
            scale = gridPerUnit/pow(2,level);
            gridX = math.floor(float(arr[2])*scale);
            gridY = math.floor(float(arr[3])*scale);
            id = str(level)+"_"+str(gridX)+"_"+str(gridY)

            if id in levelData[level]:
                data = levelData[level][id]
                data.TSP[source] += float(arr[5])
                data.PM[source] += float(arr[6])
                data.PM6[source] += float(arr[7])
                data.PM25[source] += float(arr[8])
                data.SOX[source] += float(arr[9])
                data.NOX[source] += float(arr[10])
                data.THC[source] += float(arr[11])
                data.NMHC[source] += float(arr[12])
                data.CO[source] += float(arr[17])
                data.PB[source] += float(arr[18])
            else:
                data = SumData(gridX, gridY)
                data.TSP[source] += float(arr[5])
                data.PM[source] += float(arr[6])
                data.PM6[source] += float(arr[7])
                data.PM25[source] += float(arr[8])
                data.SOX[source] += float(arr[9])
                data.NOX[source] += float(arr[10])
                data.THC[source] += float(arr[11])
                data.NMHC[source] += float(arr[12])
                data.CO[source] += float(arr[17])
                data.PB[source] += float(arr[18])
                levelData[level][id] = data

    #============area source===========
    for line in open(areaFile,errors="ignore"):
        source = "AREA"
        #去掉最後面的\n再依,分開成陣列
        arr = line[0:-1].split(",")
        
        #略過第一列
        if "NSC" in arr[0]:
            continue
                
        for level in levelArr:
            scale = gridPerUnit/pow(2,level);
            gridX = math.floor(float(arr[2])*scale);
            gridY = math.floor(float(arr[3])*scale);
            id = str(level)+"_"+str(gridX)+"_"+str(gridY)

            if id in levelData[level]:
                data = levelData[level][id]
                data.TSP[source] += float(arr[5])
                data.PM[source] += float(arr[6])
                data.PM6[source] += float(arr[7])
                data.PM25[source] += float(arr[8])
                data.SOX[source] += float(arr[9])
                data.NOX[source] += float(arr[10])
                data.THC[source] += float(arr[11])
                data.NMHC[source] += float(arr[12])
                data.CO[source] += float(arr[13])
                data.PB[source] += float(arr[14])
            else:
                data = SumData(gridX, gridY)
                data.TSP[source] += float(arr[5])
                data.PM[source] += float(arr[6])
                data.PM6[source] += float(arr[7])
                data.PM25[source] += float(arr[8])
                data.SOX[source] += float(arr[9])
                data.NOX[source] += float(arr[10])
                data.THC[source] += float(arr[11])
                data.NMHC[source] += float(arr[12])
                data.CO[source] += float(arr[13])
                data.PB[source] += float(arr[14])
                levelData[level][id] = data
                
                
    #===========add grid to db==========
    field = "TYPE, GRID_X, GRID_Y, TSP, PM, PM6, PM25, SOX, NOX, THC, NMHC, CO, PB"
    for key in levelData[0]:
        data = levelData[0][key]

        with connection.cursor() as cursor:
            source = "POINT"
            val = "'"+source+"',"+str(data.GRID_X)+","+str(data.GRID_Y)+","
            val += str(data.TSP[source])+","
            val += str(data.PM[source])+","
            val += str(data.PM6[source])+","
            val += str(data.PM25[source])+","
            val += str(data.SOX[source])+","
            val += str(data.NOX[source])+","
            val += str(data.THC[source])+","
            val += str(data.NMHC[source])+","
            val += str(data.CO[source])+","
            val += str(data.PB[source])
            sql = "INSERT INTO SumSources ("+field+") VALUES ("+val+");"

            source = "LINE"
            val = "'"+source+"',"+str(data.GRID_X)+","+str(data.GRID_Y)+","
            val += str(data.TSP[source])+","
            val += str(data.PM[source])+","
            val += str(data.PM6[source])+","
            val += str(data.PM25[source])+","
            val += str(data.SOX[source])+","
            val += str(data.NOX[source])+","
            val += str(data.THC[source])+","
            val += str(data.NMHC[source])+","
            val += str(data.CO[source])+","
            val += str(data.PB[source])
            sql += "INSERT INTO SumSources ("+field+") VALUES ("+val+");"

            source = "AREA"
            val = "'"+source+"',"+str(data.GRID_X)+","+str(data.GRID_Y)+","
            val += str(data.TSP[source])+","
            val += str(data.PM[source])+","
            val += str(data.PM6[source])+","
            val += str(data.PM25[source])+","
            val += str(data.SOX[source])+","
            val += str(data.NOX[source])+","
            val += str(data.THC[source])+","
            val += str(data.NMHC[source])+","
            val += str(data.CO[source])+","
            val += str(data.PB[source])
            sql += "INSERT INTO SumSources ("+field+") VALUES ("+val+");"

            cursor.execute(sql)

        connection.commit()
    
    levelField = "LEVEL, GRID_X, GRID_Y, TSP, PM, PM6, PM25, SOX, NOX, THC, NMHC, CO, PB"
    for level in levelArr:
        print("Level "+str(level)+": 網格數: "+str(len(levelData[level].keys())))
        for key in levelData[level]:
            data = levelData[level][key]
            levelVal = str(level)+","+str(data.GRID_X)+","+str(data.GRID_Y)+","

            with connection.cursor() as cursor:
                levelVal += str(data.GetTSP())+","
                levelVal += str(data.GetPM())+","
                levelVal += str(data.GetPM6())+","
                levelVal += str(data.GetPM25())+","
                levelVal += str(data.GetSOX())+","
                levelVal += str(data.GetNOX())+","
                levelVal += str(data.GetTHC())+","
                levelVal += str(data.GetNMHC())+","
                levelVal += str(data.GetCO())+","
                levelVal += str(data.GetPB())
                
                sql = "INSERT INTO SumGrids ("+levelField+") VALUES ("+levelVal+")"
                #print(sql)
                cursor.execute(sql)

            connection.commit()
            
        
    elapseTime = time.time() - startTime
    print("Sum all sources finished in "+str(elapseTime)+" s")

    

config = json.loads(open("config.json").read())

auth = config["mysqlAuth"]
connection = pymysql.connect(host='localhost',user=auth["username"],
                password=auth["password"],db=auth["dbName"],
                charset='utf8',cursorclass=pymysql.cursors.DictCursor)

InsertPointSource('data/point.csv', 0)
InsertLineSource('data/linegrid.csv', 0)
InsertAreaSource('data/areagrid.csv', 0)
InsertBioSource('data/biogrid.csv', 0)
InsertNH3Source('data/nh3grid.csv', 0)
SumAllSource('data/point.csv', 'data/linegrid.csv', 'data/areagrid.csv')

#create index
with connection.cursor() as cursor:
    
    sql = "CREATE INDEX PosIndex ON PointSources (WGS84_E,WGS84_N);"
    sql += "CREATE INDEX PosIndex ON LineSources (WGS84_E,WGS84_N);"
    sql += "CREATE INDEX PosIndex ON AreaSources (WGS84_E,WGS84_N);"
    sql += "CREATE INDEX PosIndex ON BioSources (WGS84_E,WGS84_N);"
    sql += "CREATE INDEX PosIndex ON NH3Sources (WGS84_E,WGS84_N);"
    
    sql += "CREATE INDEX PosIndex ON PointGroups (WGS84_E,WGS84_N);"
    sql += "CREATE INDEX PosIndex ON LineGroups (WGS84_E,WGS84_N);"
    sql += "CREATE INDEX PosIndex ON AreaGroups (WGS84_E,WGS84_N);"
    sql += "CREATE INDEX PosIndex ON BioGroups (WGS84_E,WGS84_N);"
    sql += "CREATE INDEX PosIndex ON NH3Groups (WGS84_E,WGS84_N);"

    sql += "CREATE INDEX PosIndex ON SumSources (GRID_X,GRID_Y);"
    cursor.execute(sql)
connection.commit()

connection.close()
