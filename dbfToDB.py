from dbfread import DBF
import json
import pymysql
import math
import time

levelRange = range(1,6)
gridPerUnit = 100

def GenValue(record, keyStr):
    val = ""
    arr = keyStr.split(",")
    
    n = len(arr)
    for i in range(0,n):
        key = arr[i].strip()
        value = record[key]
        #字串
        if isinstance(value,str):
            val+="'"+value+"'"
        else:   #數字
            val+=str(value)
        if i < n-1:
            val+=","
    return val

def AccumulateData(src, dst, keyMap):
    for srcKey in keyMap:
        if not (srcKey in src):
            continue
        
        dstKey = keyMap[srcKey]
        if dstKey in dst:
            dst[dstKey] += src[srcKey]
        else:
            dst[dstKey] = src[srcKey]
            

#==========================================================
def InsertPointSource(filename):
    print("Insert point source started")
    startTime = time.time()

    field = "DICT_NO, C_NO, SCC, NO_P, FC,\
    TSP_EMI, PM_EMI, PM6_EMI, PM25_EMI, SOX_EMI, NOX_EMI, THC_EMI, NMHC_EMI, CO_EMI, PB_EMI,\
    COMP_KIND1, WGS84_E, WGS84_N, ORI_QU1, DIA, HEI, TEMP, VEL,\
    ASSUME_Q, ASSUME_D, ASSUME_H, ASSUME_T, ASSUME_V,\
    NO_S, ASSUME_HD, HD1, ASSUME_DW, DW1, ASSUME_WY, WY1,\
    EQ_1, A_NAME1, EQ_2, A_NAME2, EQ_3, A_NAME3, EQ_4, A_NAME4, EQ_5, A_NAME5,\
    TSP_EFF, SOX_EFF, NOX_EFF, THC_EFF, CO_EFF, PB_EFF,\
    ID_AREA, COMP_NAM, ZS, TSP_RANK, SOX_RANK, NOX_RANK, VOC_RANK, CO_RANK, PB_RANK"

    keyStr = field.replace("THC_EFF","VOC_EFF")

    keyMap = {}
    keyMap["TSP_EMI"] = "TSP_EMI"
    keyMap["PM_EMI"] = "PM_EMI"
    keyMap["PM6_EMI"] = "PM6_EMI"
    keyMap["PM25_EMI"] = "PM25_EMI"
    keyMap["SOX_EMI"] = "SOX_EMI"
    keyMap["NOX_EMI"] = "NOX_EMI"
    keyMap["THC_EMI"] = "THC_EMI"
    keyMap["NMHC_EMI"] = "NMHC_EMI"
    keyMap["CO_EMI"] = "CO_EMI"
    keyMap["PB_EMI"] = "PB_EMI"

    groupData = {}
    levelData = {}
    for i in levelRange:
        levelData[i] = {}
    
    for record in DBF(filename,char_decode_errors="ignore"):
        val = GenValue(record,keyStr)
        
        with connection.cursor() as cursor:
            sql = "INSERT INTO PointSources ("+field+") VALUES ("+val+")"
            cursor.execute(sql)

        connection.commit()

        #==========group data (依座標分群)=========
        pos = str(record["WGS84_E"])+","+str(record["WGS84_N"])
        if pos in groupData:
            data = groupData[pos]
            AccumulateData(record, data, keyMap)
        else:
            data = {}
            data["WGS84_E"] = record["WGS84_E"]
            data["WGS84_N"] = record["WGS84_N"]
            AccumulateData(record, data, keyMap)
            groupData[pos] = data

        #=========先在memory加總，最後再一起存進db=========
        for level in levelRange:
            scale = gridPerUnit/pow(2,level);
            gridX = math.floor(record["WGS84_E"]*scale);
            gridY = math.floor(record["WGS84_N"]*scale);
            id = str(level)+"_"+str(gridX)+"_"+str(gridY)

            if id in levelData[level]:
                data = levelData[level][id]
                AccumulateData(record, data, keyMap)
            else:
                data = {}
                data["GRID_X"] = gridX
                data["GRID_Y"] = gridY
                AccumulateData(record, data, keyMap)
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
        
        with connection.cursor() as cursor:
            groupVal = GenValue(data, groupField)
            sql = "INSERT INTO PointGroups ("+groupField+") VALUES ("+groupVal+")"
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
            data["LEVEL"] = level

            with connection.cursor() as cursor:
                levelVal = GenValue(data, levelField)
                sql = "INSERT INTO PointGrids ("+levelField+") VALUES ("+levelVal+")"
                cursor.execute(sql)

            connection.commit()   
        
    elapseTime = time.time() - startTime
    print("Insert point grid finished in "+str(elapseTime)+" s")

#==========================================================
def InsertLineSource(filename):
    print("Insert line source started")
    startTime = time.time()
    
    field = "NSC, NSC_SUB, WGS84_E, WGS84_N, DICT,\
    EM_TSP, EM_PM, EM_PM6, EM_PM25, EM_SOX, EM_NOX,\
    EM_THC, EM_NMHC, EM_EXHC, EM_EHC, EM_RHC, EM_RST,\
    EM_CO, EM_PB, EM_NH3"

    keyMap = {}
    keyMap["EM_TSP"] = "EM_TSP"
    keyMap["EM_PM"] = "EM_PM"
    keyMap["EM_PM6"] = "EM_PM6"
    keyMap["EM_PM25"] = "EM_PM25"
    keyMap["EM_SOX"] = "EM_SOX"
    keyMap["EM_NOX"] = "EM_NOX"
    keyMap["EM_THC"] = "EM_THC"
    keyMap["EM_NMHC"] = "EM_NMHC"
    keyMap["EM_EXHC"] = "EM_EXHC"
    keyMap["EM_EHC"] = "EM_EHC"
    keyMap["EM_RHC"] = "EM_RHC"
    keyMap["EM_RST"] = "EM_RST"
    keyMap["EM_CO"] = "EM_CO"
    keyMap["EM_PB"] = "EM_PB"
    keyMap["EM_NH3"] = "EM_NH3"
            
    groupData = {}
    levelData = {}
    for i in levelRange:
        levelData[i] = {}

    for record in DBF(filename,char_decode_errors="ignore"):
        val = GenValue(record,field)

        with connection.cursor() as cursor:
            sql = "INSERT INTO LineSources ("+field+") VALUES ("+val+")"
            cursor.execute(sql)

        connection.commit()

        #==========group data (依座標分群)=========
        pos = str(record["WGS84_E"])+","+str(record["WGS84_N"])
        if pos in groupData:
            data = groupData[pos]
            AccumulateData(record, data, keyMap)
        else:
            data = {}
            data["WGS84_E"] = record["WGS84_E"]
            data["WGS84_N"] = record["WGS84_N"]
            AccumulateData(record, data, keyMap)
            groupData[pos] = data

        #===========先在memory加總，最後再一起存進db=========
        for level in levelRange:
            scale = gridPerUnit/pow(2,level);
            gridX = math.floor(record["WGS84_E"]*scale);
            gridY = math.floor(record["WGS84_N"]*scale);
            id = str(level)+"_"+str(gridX)+"_"+str(gridY)

            if id in levelData[level]:
                data = levelData[level][id]
                AccumulateData(record, data, keyMap)
            else:
                data = {}
                data["GRID_X"] = gridX
                data["GRID_Y"] = gridY
                AccumulateData(record, data, keyMap)
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

        with connection.cursor() as cursor:
            groupVal = GenValue(data, groupField)
            sql = "INSERT INTO LineGroups ("+groupField+") VALUES ("+groupVal+")"
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
            data["LEVEL"] = level
            
            with connection.cursor() as cursor:
                levelVal = GenValue(data, levelField)
                sql = "INSERT INTO LineGrids ("+levelField+") VALUES ("+levelVal+")"
                cursor.execute(sql)

            connection.commit()
            
        
    elapseTime = time.time() - startTime
    print("Insert line grid finished in "+str(elapseTime)+" s")

#==========================================================
def InsertAreaSource(filename):
    print("Insert area source started")
    startTime = time.time()
    
    field = "NSC, NSC_SUB, WGS84_E, WGS84_N, DICT,\
    EM_TSP, EM_PM, EM_PM6, EM_PM25, EM_SOX, EM_NOX,\
    EM_THC, EM_NMHC,EM_CO, EM_PB, EM_NH3"

    keyMap = {}
    keyMap["EM_TSP"] = "EM_TSP"
    keyMap["EM_PM"] = "EM_PM"
    keyMap["EM_PM6"] = "EM_PM6"
    keyMap["EM_PM25"] = "EM_PM25"
    keyMap["EM_SOX"] = "EM_SOX"
    keyMap["EM_NOX"] = "EM_NOX"
    keyMap["EM_THC"] = "EM_THC"
    keyMap["EM_NMHC"] = "EM_NMHC"
    keyMap["EM_CO"] = "EM_CO"
    keyMap["EM_PB"] = "EM_PB"
    keyMap["EM_NH3"] = "EM_NH3"

    groupData = {}
    levelData = {}
    for i in levelRange:
        levelData[i] = {}

    for record in DBF(filename,char_decode_errors="ignore"):
        val = GenValue(record,field)

        with connection.cursor() as cursor:
            sql = "INSERT INTO AreaSources ("+field+") VALUES ("+val+")"
            cursor.execute(sql)

        connection.commit()

        #==========group data (依座標分群)=========
        pos = str(record["WGS84_E"])+","+str(record["WGS84_N"])
        if pos in groupData:
            data = groupData[pos]
            AccumulateData(record, data, keyMap)
        else:
            data = {}
            data["WGS84_E"] = record["WGS84_E"]
            data["WGS84_N"] = record["WGS84_N"]
            AccumulateData(record, data, keyMap)
            groupData[pos] = data

        #===========先在memory加總，最後再一起存進db=========
        for level in levelRange:
            scale = gridPerUnit/pow(2,level);
            gridX = math.floor(record["WGS84_E"]*scale);
            gridY = math.floor(record["WGS84_N"]*scale);
            id = str(level)+"_"+str(gridX)+"_"+str(gridY)

            if id in levelData[level]:
                data = levelData[level][id]
                AccumulateData(record, data, keyMap)
            else:
                data = {}
                data["GRID_X"] = gridX
                data["GRID_Y"] = gridY
                AccumulateData(record, data, keyMap)
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

        with connection.cursor() as cursor:
            groupVal = GenValue(data, groupField)
            sql = "INSERT INTO AreaGroups ("+groupField+") VALUES ("+groupVal+")"
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
            data["LEVEL"] = level
            
            with connection.cursor() as cursor:
                levelVal = GenValue(data, levelField)
                sql = "INSERT INTO AreaGrids ("+levelField+") VALUES ("+levelVal+")"
                cursor.execute(sql)

            connection.commit()
            
        
    elapseTime = time.time() - startTime
    print("Insert area grid finished in "+str(elapseTime)+" s")

#==========================================================
def InsertBioSource(filename):
    print("Insert bio source started")
    startTime = time.time()
    
    field = "WGS84_E, WGS84_N,\
    TOTAL_NMHC, ISO, MONO, ONMHC, MBO"

    keyMap = {}
    keyMap["TOTAL_NMHC"] = "TOTAL_NMHC"
    keyMap["ISO"] = "ISO"
    keyMap["MONO"] = "MONO"
    keyMap["ONMHC"] = "ONMHC"
    keyMap["MBO"] = "MBO"

    groupData = {}
    levelData = {}
    for i in levelRange:
        levelData[i] = {}

    for record in DBF(filename,char_decode_errors="ignore"):
        val = GenValue(record,field)

        with connection.cursor() as cursor:
            sql = "INSERT INTO BioSources ("+field+") VALUES ("+val+")"
            cursor.execute(sql)

        connection.commit()

        #==========group data (依座標分群)=========
        pos = str(record["WGS84_E"])+","+str(record["WGS84_N"])
        if pos in groupData:
            data = groupData[pos]
            AccumulateData(record, data, keyMap)
        else:
            data = {}
            data["WGS84_E"] = record["WGS84_E"]
            data["WGS84_N"] = record["WGS84_N"]
            AccumulateData(record, data, keyMap)
            groupData[pos] = data

        #===========先在memory加總，最後再一起存進db=========
        for level in levelRange:
            scale = gridPerUnit/pow(2,level);
            gridX = math.floor(record["WGS84_E"]*scale);
            gridY = math.floor(record["WGS84_N"]*scale);
            id = str(level)+"_"+str(gridX)+"_"+str(gridY)

            if id in levelData[level]:
                data = levelData[level][id]
                AccumulateData(record, data, keyMap)
            else:
                data = {}
                data["GRID_X"] = gridX
                data["GRID_Y"] = gridY
                AccumulateData(record, data, keyMap)
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

        with connection.cursor() as cursor:
            groupVal = GenValue(data, groupField)
            sql = "INSERT INTO BioGroups ("+groupField+") VALUES ("+groupVal+")"
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
            data["LEVEL"] = level
            
            with connection.cursor() as cursor:
                levelVal = GenValue(data, levelField)
                sql = "INSERT INTO BioGrids ("+levelField+") VALUES ("+levelVal+")"
                cursor.execute(sql)

            connection.commit()
            
        
    elapseTime = time.time() - startTime
    print("Insert bio grid finished in "+str(elapseTime)+" s")

#==========================================================
def InsertNH3Source(filename):
    print("Insert NH3 source started")
    startTime = time.time()
    
    field = "NSC, NSC_SUB, WGS84_E, WGS84_N, DICT, EM_NH3"

    keyMap = {}
    keyMap["EM_NH3"] = "EM_NH3"

    groupData = {}
    levelData = {}
    for i in levelRange:
        levelData[i] = {}

    for record in DBF(filename,char_decode_errors="ignore"):
        val = GenValue(record,field)

        with connection.cursor() as cursor:
            sql = "INSERT INTO NH3Sources ("+field+") VALUES ("+val+")"
            cursor.execute(sql)

        connection.commit()

        #==========group data (依座標分群)=========
        pos = str(record["WGS84_E"])+","+str(record["WGS84_N"])
        if pos in groupData:
            data = groupData[pos]
            AccumulateData(record, data, keyMap)
        else:
            data = {}
            data["WGS84_E"] = record["WGS84_E"]
            data["WGS84_N"] = record["WGS84_N"]
            AccumulateData(record, data, keyMap)
            groupData[pos] = data

        #===========先在memory加總，最後再一起存進db=========
        for level in levelRange:
            scale = gridPerUnit/pow(2,level);
            gridX = math.floor(record["WGS84_E"]*scale);
            gridY = math.floor(record["WGS84_N"]*scale);
            id = str(level)+"_"+str(gridX)+"_"+str(gridY)

            if id in levelData[level]:
                data = levelData[level][id]
                AccumulateData(record, data, keyMap)
            else:
                data = {}
                data["GRID_X"] = gridX
                data["GRID_Y"] = gridY
                AccumulateData(record, data, keyMap)
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

        with connection.cursor() as cursor:
            groupVal = GenValue(data, groupField)
            sql = "INSERT INTO NH3Groups ("+groupField+") VALUES ("+groupVal+")"
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
            data["LEVEL"] = level
            
            with connection.cursor() as cursor:
                levelVal = GenValue(data, levelField)
                sql = "INSERT INTO NH3Grids ("+levelField+") VALUES ("+levelVal+")"
                cursor.execute(sql)

            connection.commit()
            
        
    elapseTime = time.time() - startTime
    print("Insert NH3 grid finished in "+str(elapseTime)+" s")

#==========================sum all source=============================
class SumData:
    def __init__(self, gridX, gridY):
        self.GRID_X = gridX
        self.GRID_Y = gridY
        self.data = {}
        self.data["TSP"] = {'POINT':0, 'LINE':0, 'AREA':0}
        self.data["PM"] = {'POINT':0, 'LINE':0, 'AREA':0}
        self.data["PM6"] = {'POINT':0, 'LINE':0, 'AREA':0}
        self.data["PM25"] = {'POINT':0, 'LINE':0, 'AREA':0}
        self.data["SOX"] = {'POINT':0, 'LINE':0, 'AREA':0}
        self.data["NOX"] = {'POINT':0, 'LINE':0, 'AREA':0}
        self.data["THC"] = {'POINT':0, 'LINE':0, 'AREA':0}
        self.data["NMHC"] = {'POINT':0, 'LINE':0, 'AREA':0}
        self.data["CO"] = {'POINT':0, 'LINE':0, 'AREA':0}
        self.data["PB"] = {'POINT':0, 'LINE':0, 'AREA':0}

    def GetData(self, key):
        return self.data[key]["POINT"]+self.data[key]["LINE"]+self.data[key]["AREA"]

    def AccumulateData(self, source, record, keyMap):
        for srcKey in keyMap:
            dstKey = keyMap[srcKey]
            self.data[dstKey][source] += record[srcKey]

    def GenValueBySource(self, source):
        val = "'"+source+"',"
        val += str(self.GRID_X)+","
        val += str(self.GRID_Y)+","
        val += str(self.data["TSP"][source])+","
        val += str(self.data["PM"][source])+","
        val += str(self.data["PM6"][source])+","
        val += str(self.data["PM25"][source])+","
        val += str(self.data["SOX"][source])+","
        val += str(self.data["NOX"][source])+","
        val += str(self.data["THC"][source])+","
        val += str(self.data["NMHC"][source])+","
        val += str(self.data["CO"][source])+","
        val += str(self.data["PB"][source])
        return val

    def GenValue(self):
        val = str(self.GRID_X)+","
        val += str(self.GRID_Y)+","
        val += str(self.GetData("TSP"))+","
        val += str(self.GetData("PM"))+","
        val += str(self.GetData("PM6"))+","
        val += str(self.GetData("PM25"))+","
        val += str(self.GetData("SOX"))+","
        val += str(self.GetData("NOX"))+","
        val += str(self.GetData("THC"))+","
        val += str(self.GetData("NMHC"))+","
        val += str(self.GetData("CO"))+","
        val += str(self.GetData("PB"))
        return val
 
            
def SumAllSource(pointFile, lineFile, areaFile):
    print("Sum all sources started")
    startTime = time.time()

    levelData = {}
    levelArr = [0]+list(levelRange)
    for i in levelArr:
        levelData[i] = {}

    #============point source===========
    pointKeyMap = {}
    pointKeyMap["TSP_EMI"] = "TSP"
    pointKeyMap["PM_EMI"] = "PM"
    pointKeyMap["PM6_EMI"] = "PM6"
    pointKeyMap["PM25_EMI"] = "PM25"
    pointKeyMap["SOX_EMI"] = "SOX"
    pointKeyMap["NOX_EMI"] = "NOX"
    pointKeyMap["THC_EMI"] = "THC"
    pointKeyMap["NMHC_EMI"] = "NMHC"
    pointKeyMap["CO_EMI"] = "CO"
    pointKeyMap["PB_EMI"] = "PB"
    
    source = "POINT"
    for record in DBF(pointFile,char_decode_errors="ignore"):
        for level in levelArr:
            scale = gridPerUnit/pow(2,level);
            gridX = math.floor(record["WGS84_E"]*scale);
            gridY = math.floor(record["WGS84_N"]*scale);
            id = str(level)+"_"+str(gridX)+"_"+str(gridY)

            if id in levelData[level]:
                data = levelData[level][id]
                data.AccumulateData(source, record, pointKeyMap)
            else:
                data = SumData(gridX, gridY)
                data.AccumulateData(source, record, pointKeyMap)
                levelData[level][id] = data

    #============line source===========
    lineKeyMap = {}
    lineKeyMap["EM_TSP"] = "TSP"
    lineKeyMap["EM_PM"] = "PM"
    lineKeyMap["EM_PM6"] = "PM6"
    lineKeyMap["EM_PM25"] = "PM25"
    lineKeyMap["EM_SOX"] = "SOX"
    lineKeyMap["EM_NOX"] = "NOX"
    lineKeyMap["EM_THC"] = "THC"
    lineKeyMap["EM_NMHC"] = "NMHC"
    lineKeyMap["EM_CO"] = "CO"
    lineKeyMap["EM_PB"] = "PB"
    
    source = "LINE"
    for record in DBF(lineFile,char_decode_errors="ignore"):
        for level in levelArr:
            scale = gridPerUnit/pow(2,level);
            gridX = math.floor(record["WGS84_E"]*scale);
            gridY = math.floor(record["WGS84_N"]*scale);
            id = str(level)+"_"+str(gridX)+"_"+str(gridY)

            if id in levelData[level]:
                data = levelData[level][id]
                data.AccumulateData(source, record, lineKeyMap)
            else:
                data = SumData(gridX, gridY)
                data.AccumulateData(source, record, lineKeyMap)
                levelData[level][id] = data

    #============area source===========
    areaKeyMap = {}
    areaKeyMap["EM_TSP"] = "TSP"
    areaKeyMap["EM_PM"] = "PM"
    areaKeyMap["EM_PM6"] = "PM6"
    areaKeyMap["EM_PM25"] = "PM25"
    areaKeyMap["EM_SOX"] = "SOX"
    areaKeyMap["EM_NOX"] = "NOX"
    areaKeyMap["EM_THC"] = "THC"
    areaKeyMap["EM_NMHC"] = "NMHC"
    areaKeyMap["EM_CO"] = "CO"
    areaKeyMap["EM_PB"] = "PB"
    
    source = "AREA"
    for record in DBF(areaFile,char_decode_errors="ignore"):
                
        for level in levelArr:
            scale = gridPerUnit/pow(2,level);
            gridX = math.floor(record["WGS84_E"]*scale);
            gridY = math.floor(record["WGS84_N"]*scale);
            id = str(level)+"_"+str(gridX)+"_"+str(gridY)

            if id in levelData[level]:
                data = levelData[level][id]
                data.AccumulateData(source, record, areaKeyMap)
            else:
                data = SumData(gridX, gridY)
                data.AccumulateData(source, record, areaKeyMap)
                levelData[level][id] = data
                
                
    #===========add grid to db==========
    field = "TYPE, GRID_X, GRID_Y, TSP, PM, PM6, PM25, SOX, NOX, THC, NMHC, CO, PB"
    for key in levelData[0]:
        data = levelData[0][key]

        with connection.cursor() as cursor:
            val = data.GenValueBySource("POINT")
            sql = "INSERT INTO SumSources ("+field+") VALUES ("+val+");"

            val = data.GenValueBySource("LINE")
            sql += "INSERT INTO SumSources ("+field+") VALUES ("+val+");"

            val = data.GenValueBySource("AREA")
            sql += "INSERT INTO SumSources ("+field+") VALUES ("+val+");"

            cursor.execute(sql)

        connection.commit()
    
    levelField = "LEVEL, GRID_X, GRID_Y, TSP, PM, PM6, PM25, SOX, NOX, THC, NMHC, CO, PB"
    for level in levelArr:
        print("Level "+str(level)+": 網格數: "+str(len(levelData[level].keys())))
        for key in levelData[level]:
            data = levelData[level][key]
            
            with connection.cursor() as cursor:
                levelVal = str(level)+","+data.GenValue()                
                sql = "INSERT INTO SumGrids ("+levelField+") VALUES ("+levelVal+")"
                cursor.execute(sql)

            connection.commit()
            
    elapseTime = time.time() - startTime
    print("Sum all sources finished in "+str(elapseTime)+" s")

#=============create index============
def CreateIndex():
    print("Create index started")
    startTime = time.time()
    
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

    elapseTime = time.time() - startTime
    print("Create index finished in "+str(elapseTime)+" s")

#================statistic============
def DataStatistic(pointFile, lineFile, areaFile):
    print("data statistic started")
    startTime = time.time()
    
    sourceSum = {"POINT": {}, "LINE": {}, "AREA": {}}
    for s in sourceSum:
        sourceSum[s]["TSP"] = 0
        sourceSum[s]["PM"] = 0
        sourceSum[s]["PM6"] = 0
        sourceSum[s]["PM25"] = 0
        sourceSum[s]["SOX"] = 0
        sourceSum[s]["NOX"] = 0
        sourceSum[s]["THC"] = 0
        sourceSum[s]["NMHC"] = 0
        sourceSum[s]["CO"] = 0
        sourceSum[s]["PB"] = 0
        
    companySum = {}     #點源
    carSum = {}         #線源
    areaSum = {}        #面源
    citySum = {}        #點源+線源+面源
    industrySum = {}    #點源
    #==========point source==========
    keyMap = {}
    keyMap["TSP_EMI"] = "TSP"
    keyMap["PM_EMI"] = "PM"
    keyMap["PM6_EMI"] = "PM6"
    keyMap["PM25_EMI"] = "PM25"
    keyMap["SOX_EMI"] = "SOX"
    keyMap["NOX_EMI"] = "NOX"
    keyMap["THC_EMI"] = "THC"
    keyMap["NMHC_EMI"] = "NMHC"
    keyMap["CO_EMI"] = "CO"
    keyMap["PB_EMI"] = "PB"
    
    for record in DBF(pointFile,char_decode_errors="ignore"):
        C_NO = record["C_NO"]
        DICT = record["DICT_NO"]
        COMP_KIND1 = record["COMP_KIND1"]
        
        if C_NO in companySum:
            data = companySum[C_NO]
            AccumulateData(record, data, keyMap)
        else:
            data = {"NAME": record["COMP_NAM"]}
            AccumulateData(record, data, keyMap)
            companySum[C_NO] = data

        if DICT in citySum:
            if C_NO in citySum[DICT]["POINT"]:
                data = citySum[DICT]["POINT"][C_NO]
                AccumulateData(record, data, keyMap)
            else:
                data = {"NAME": record["COMP_NAM"]}
                AccumulateData(record, data, keyMap)
                citySum[DICT]["POINT"][C_NO] = data
                
            dataSum = citySum[DICT]["SUM"]["POINT"]
            AccumulateData(record, dataSum, keyMap)

        else:
            data = {"NAME": record["COMP_NAM"]}
            AccumulateData(record, data, keyMap)
            citySum[DICT] = {"POINT":{}, "LINE":{}, "AREA":{}, "SUM": {}}
            citySum[DICT]["SUM"]["POINT"] = {}
            citySum[DICT]["SUM"]["LINE"] = {}
            citySum[DICT]["SUM"]["AREA"] = {}
            
            citySum[DICT]["POINT"][C_NO] = data
            dataSum = citySum[DICT]["SUM"]["POINT"]
            AccumulateData(record, dataSum, keyMap)

        if COMP_KIND1 in industrySum:
            data = industrySum[COMP_KIND1]
            AccumulateData(record, data, keyMap)
        else:
            data = {}
            AccumulateData(record, data, keyMap)
            industrySum[COMP_KIND1] = data
    
    #==========line source==========
    keyMap = {}
    keyMap["EM_TSP"] = "TSP"
    keyMap["EM_PM"] = "PM"
    keyMap["EM_PM6"] = "PM6"
    keyMap["EM_PM25"] = "PM25"
    keyMap["EM_SOX"] = "SOX"
    keyMap["EM_NOX"] = "NOX"
    keyMap["EM_THC"] = "THC"
    keyMap["EM_NMHC"] = "NMHC"
    keyMap["EM_CO"] = "CO"
    keyMap["EM_PB"] = "PB"
    
    for record in DBF(lineFile,char_decode_errors="ignore"):
        NSC = record["NSC"]
        DICT = record["DICT"]
                
        if NSC in carSum:
            data = carSum[NSC]
            AccumulateData(record, data, keyMap)
        else:
            data = {}
            AccumulateData(record, data, keyMap)
            carSum[NSC] = data

        if DICT in citySum:
            if NSC in citySum[DICT]["LINE"]:
                data = citySum[DICT]["LINE"][NSC]
                AccumulateData(record, data, keyMap)
            else:
                data = {}
                AccumulateData(record, data, keyMap)
                citySum[DICT]["LINE"][NSC] = data
                
            dataSum = citySum[DICT]["SUM"]["LINE"]
            AccumulateData(record, dataSum, keyMap)
        else:
            data = {}
            AccumulateData(record, data, keyMap)
            citySum[DICT] = {"POINT":{}, "LINE":{}, "AREA":{}, "SUM": {}}
            citySum[DICT]["SUM"]["POINT"] = {}
            citySum[DICT]["SUM"]["LINE"] = {}
            citySum[DICT]["SUM"]["AREA"] = {}
            
            citySum[DICT]["LINE"][C_NO] = data
            dataSum = citySum[DICT]["SUM"]["LINE"]
            AccumulateData(record, dataSum, keyMap)

    #==========area source==========
    keyMap = {}
    keyMap["EM_TSP"] = "TSP"
    keyMap["EM_PM"] = "PM"
    keyMap["EM_PM6"] = "PM6"
    keyMap["EM_PM25"] = "PM25"
    keyMap["EM_SOX"] = "SOX"
    keyMap["EM_NOX"] = "NOX"
    keyMap["EM_THC"] = "THC"
    keyMap["EM_NMHC"] = "NMHC"
    keyMap["EM_CO"] = "CO"
    keyMap["EM_PB"] = "PB"
    
    for record in DBF(areaFile,char_decode_errors="ignore"):
        NSC = record["NSC"]
        DICT = record["DICT"]
                
        if NSC in areaSum:
            data = areaSum[NSC]
            AccumulateData(record, data, keyMap)
        else:
            data = {}
            AccumulateData(record, data, keyMap)
            areaSum[NSC] = data

        if DICT in citySum:
            if NSC in citySum[DICT]["AREA"]:
                data = citySum[DICT]["AREA"][NSC]
                AccumulateData(record, data, keyMap)
            else:
                data = {}
                AccumulateData(record, data, keyMap)
                citySum[DICT]["AREA"][NSC] = data

            dataSum = citySum[DICT]["SUM"]["AREA"]
            AccumulateData(record, dataSum, keyMap)
        else:
            data = {}
            AccumulateData(record, data, keyMap)
            citySum[DICT] = {"POINT":{}, "LINE":{}, "AREA":{}, "SUM": {}}
            citySum[DICT]["SUM"]["POINT"] = {}
            citySum[DICT]["SUM"]["LINE"] = {}
            citySum[DICT]["SUM"]["AREA"] = {}
            
            citySum[DICT]["AREA"][C_NO] = data
            dataSum = citySum[DICT]["SUM"]["AREA"]
            AccumulateData(record, dataSum, keyMap)

    #==========source sum============
    for key in companySum:
        for pollute in companySum[key]:
            if pollute == "NAME":
                continue
            sourceSum["POINT"][pollute] += companySum[key][pollute]

    for key in carSum:
        for pollute in carSum[key]:
            sourceSum["LINE"][pollute] += carSum[key][pollute]

    for key in areaSum:
        for pollute in areaSum[key]:
            sourceSum["AREA"][pollute] += areaSum[key][pollute]
    
    #===========output json===========
    result = {}
    limitNum = 20
    def GenSortedData(data, pollute, limit):
        result = []
        sortedKey = sorted(data, key = lambda x: data[x][pollute], reverse=True)
        count = 0
        for key in sortedKey:
            count+=1
            if(count > limit):
                break
            d = data[key]
            out = {"ID": key, "SUM": d[pollute]}
            if "NAME" in d:
                out["NAME"] = d["NAME"]
            result.append(out)
        return result

    companyResult = {}
    keyArr = ["TSP","PM","PM6","PM25","SOX","NOX","THC","NMHC","CO","PB"]
    for key in keyArr:
        companyResult[key] = GenSortedData(companySum, key, limitNum)

    cityResult = {}
    for city in citySum:
        cityResult[city] = {}
        cityResult[city]["POINT"] = citySum[city]["SUM"]["POINT"]
        cityResult[city]["LINE"] = citySum[city]["SUM"]["LINE"]
        cityResult[city]["AREA"] = citySum[city]["SUM"]["AREA"]

    result["COMPANY"] = companyResult
    result["TRAFFIC"] = carSum
    result["AREA"] = areaSum
    result["CITY"] = cityResult

    industryResult = {}
    for key in keyArr:
        industryResult[key] = GenSortedData(industrySum, key, limitNum)

    result["INDUSTRY"] = industryResult
    result["TOTAL"] = sourceSum

    with open('data/statistic.json', 'w') as outfile:
        json.dump(result, outfile)

    #==========output detail for each city==========
    keyMap = {}
    keyMap["TSP"] = "TSP"
    keyMap["PM"] = "PM"
    keyMap["PM6"] = "PM6"
    keyMap["PM25"] = "PM25"
    keyMap["SOX"] = "SOX"
    keyMap["NOX"] = "NOX"
    keyMap["THC"] = "THC"
    keyMap["NMHC"] = "NMHC"
    keyMap["CO"] = "CO"
    keyMap["PB"] = "PB"
    
    cityDict = {}
    for city in citySum:
        #大行政區
        no = city[0:2]
        if not(no in cityDict):
            cityDict[no] = {"SUM": {"POINT":{},"LINE":{}, "AREA":{}}}

        dictSum = cityDict[no]["SUM"]
        AccumulateData(citySum[city]["SUM"]["POINT"], dictSum["POINT"], keyMap)
        AccumulateData(citySum[city]["SUM"]["LINE"], dictSum["LINE"], keyMap)
        AccumulateData(citySum[city]["SUM"]["AREA"], dictSum["AREA"], keyMap)

        #子行政區
        dc = {"POINT":{}, "LINE":{}, "AREA":{}, "SUM":{}}
        for key in keyArr:
            dc["POINT"][key] = GenSortedData(citySum[city]["POINT"], key, limitNum)
            dc["LINE"][key] = GenSortedData(citySum[city]["LINE"], key, limitNum)
            dc["AREA"][key] = GenSortedData(citySum[city]["AREA"], key, limitNum)
        dc["SUM"] = citySum[city]["SUM"]
        cityDict[no][city] = dc
        
    for no in cityDict:
        with open('data/city_'+no+'.json', 'w') as outfile:
            json.dump(cityDict[no], outfile)

    elapseTime = time.time() - startTime
    print("Data statistic finished in "+str(elapseTime)+" s")
      

#=================main=================
config = json.loads(open("config.json").read())

auth = config["mysqlAuth"]
connection = pymysql.connect(host='localhost',user=auth["username"],
                password=auth["password"],db=auth["dbName"],
                charset='utf8',cursorclass=pymysql.cursors.DictCursor)

#InsertPointSource("data/point.dbf")
#InsertLineSource("data/linegrid.dbf")
#InsertAreaSource("data/areagrid.dbf")
#InsertBioSource("data/biogrid.dbf")
#InsertNH3Source("data/nh3grid.dbf")
#SumAllSource('data/point.dbf', 'data/linegrid.dbf', 'data/areagrid.dbf')

#CreateIndex()
DataStatistic('data/point.dbf', 'data/linegrid.dbf', 'data/areagrid.dbf')

connection.close()
