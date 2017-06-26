import pymysql


def InsertPointSource(filename, skip):
    print("Insert point source started")
    
    field = "SERIAL_NO, DICT_NO, C_NO, SCC, NO_P, FC,\
    TSP_EMI, PM_EMI, PM6_EMI, PM25_EMI, SOX_EMI, NOX_EMI, THC_EMI, NMHC_EMI, CO_EMI, PB_EMI,\
    COMP_KIND1, WGS84_E, WGS84_N, ORI_QU1, DIA, HEI, TEMP, VEL,\
    ASSUME_Q, ASSUME_D, ASSUME_H, ASSUME_T, ASSUME_V,\
    NO_S, ASSUME_HD, HD1, ASSUME_DW, DW1, ASSUME_WY, WY1,\
    F_N1, F_Q1, UNIT, U_NAME, S1, A1,\
    EQ_1, A_NAME1, EQ_2, A_NAME2, EQ_3, A_NAME3, EQ_4, A_NAME4, EQ_5, A_NAME5,\
    TSP_EFF, SOX_EFF, NOX_EFF, THC_EFF, CO_EFF, PB_EFF,\
    ID_AREA, COMP_NAM, ZS, TSP_RANK, SOX_RANK, NOX_RANK, VOC_RANK, CO_RANK, PB_RANK"

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

    print("Insert point source finished")


def InsertLineSource(filename, skip):
    print("Insert line source started")
    
    field = "SERIAL_NO, NSC, NSC_SUB, WGS84_E, WGS84_N, DICT,\
    EM_TSP, EM_PM, EM_PM6, EM_PM25, EM_SOX, EM_NOX,\
    EM_THC, EM_NMHC, EM_EXHC, EM_EHC, EM_RHC, EM_RST,\
    EM_CO, EM_PB, EM_NH3"

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

        print("insert data"+str(serialNo))
        connection.commit()

    print("Insert line source finished")


def InsertAreaSource(filename, skip):
    print("Insert area source started")
    
    field = "SERIAL_NO, NSC, NSC_SUB, WGS84_E, WGS84_N, DICT,\
    EM_TSP, EM_PM, EM_PM6, EM_PM25, EM_SOX, EM_NOX,\
    EM_THC, EM_NMHC,EM_CO, EM_PB, EM_NH3"

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

    print("Insert area source finished")


def InsertBioSource(filename, skip):
    print("Insert bio source started")
    
    field = "SERIAL_NO,WGS84_E, WGS84_N,\
    TOTAL_NMHC, ISO, MONO, ONMHC, MBO"

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

    print("Insert bio source finished")


def InsertNH3Source(filename, skip):
    print("Insert NH3 source started")
    
    field = "SERIAL_NO, NSC, NSC_SUB, WGS84_E, WGS84_N, DICT, EM_NH3"

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

    print("Insert NH3 source finished")



connection = pymysql.connect(host='localhost',user='root',
                             password='justdoit',db='VisTEDS',
                             charset='utf8',cursorclass=pymysql.cursors.DictCursor)

#InsertPointSource('point.csv', 0)
#InsertLineSource('linegrid.csv', 0)
#InsertAreaSource('areagrid.csv', 0)
#InsertBioSource('biogrid.csv', 0)
InsertNH3Source('nh3grid.csv', 0)
connection.close()
