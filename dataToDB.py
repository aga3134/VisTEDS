import json
import pymysql
import math
import time

levelRange = range(1,7)
gridPerUnit = 100

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
#            cursor.execute(sql)

        #print("insert data"+arr[0])
#        connection.commit()

        #先在memory加總，最後再一起存進db
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
    
    #add grid to db
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


def InsertLineSource(filename, skip):
    print("Insert line source started")
    startTime = time.time()
    
    field = "SERIAL_NO, NSC, NSC_SUB, WGS84_E, WGS84_N, DICT,\
    EM_TSP, EM_PM, EM_PM6, EM_PM25, EM_SOX, EM_NOX,\
    EM_THC, EM_NMHC, EM_EXHC, EM_EHC, EM_RHC, EM_RST,\
    EM_CO, EM_PB, EM_NH3"

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
#            cursor.execute(sql)

        #print("insert data"+str(serialNo))
#        connection.commit()

        #先在memory加總，最後再一起存進db
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
    
    #add grid to db
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



def InsertAreaSource(filename, skip):
    print("Insert area source started")
    startTime = time.time()
    
    field = "SERIAL_NO, NSC, NSC_SUB, WGS84_E, WGS84_N, DICT,\
    EM_TSP, EM_PM, EM_PM6, EM_PM25, EM_SOX, EM_NOX,\
    EM_THC, EM_NMHC,EM_CO, EM_PB, EM_NH3"

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
#            cursor.execute(sql)

        #print("insert data"+str(serialNo))
#        connection.commit()

        #先在memory加總，最後再一起存進db
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
    
    #add grid to db
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


def InsertBioSource(filename, skip):
    print("Insert bio source started")
    startTime = time.time()
    
    field = "SERIAL_NO,WGS84_E, WGS84_N,\
    TOTAL_NMHC, ISO, MONO, ONMHC, MBO"

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
#            cursor.execute(sql)

        #print("insert data"+str(serialNo))
#        connection.commit()

        #先在memory加總，最後再一起存進db
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
    
    #add grid to db
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


def InsertNH3Source(filename, skip):
    print("Insert NH3 source started")
    startTime = time.time()
    
    field = "SERIAL_NO, NSC, NSC_SUB, WGS84_E, WGS84_N, DICT, EM_NH3"

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
#            cursor.execute(sql)

        #print("insert data"+str(serialNo))
#        connection.commit()

        #先在memory加總，最後再一起存進db
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
    
    #add grid to db
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



config = json.loads(open("config.json").read())

auth = config["mysqlAuth"]
connection = pymysql.connect(host='localhost',user=auth["username"],
                password=auth["password"],db=auth["dbName"],
                charset='utf8',cursorclass=pymysql.cursors.DictCursor)

#InsertPointSource('data/point.csv', 0)
InsertLineSource('data/linegrid.csv', 0)
InsertAreaSource('data/areagrid.csv', 0)
InsertBioSource('data/biogrid.csv', 0)
InsertNH3Source('data/nh3grid.csv', 0)
connection.close()
