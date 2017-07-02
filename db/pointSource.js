module.exports = function(sequelize, DataTypes) {
	return sequelize.define("pointSource", {
	  	SERIAL_NO: {	//序號
			type: DataTypes.INTEGER,
			primaryKey: true
		},
		DICT_NO: DataTypes.STRING(4),	//鄉鎮代碼
		C_NO: DataTypes.STRING(8),	//管制編號
		SCC: DataTypes.STRING(8),	//排放係數碼
		NO_P: DataTypes.STRING(4),	//污染源編號
		FC: DataTypes.STRING(3),	//排放類別，FUL表示燃燒排放
		
		TSP_EMI: DataTypes.DECIMAL(10,3),	//TSP(總懸浮微粒)排放量，單位:公噸/年
		PM_EMI: DataTypes.DECIMAL(10,3),	//PM10排放量，單位:公噸/年
		PM6_EMI: DataTypes.DECIMAL(10,3),	//PM6排放量，單位:公噸/年
		PM25_EMI: DataTypes.DECIMAL(10,3),	//PM2.5排放量，單位:公噸/年
		SOX_EMI: DataTypes.DECIMAL(10,3),	//SOx排放量，單位:公噸/年
		NOX_EMI: DataTypes.DECIMAL(10,3),	//NOx排放量，單位:公噸/年
		THC_EMI: DataTypes.DECIMAL(10,3),	//THC(總碳氫有機氣體)排放量，單位:公噸/年
		NMHC_EMI: DataTypes.DECIMAL(10,3),	//NMHC(非甲烷碳氫有機氣體)排放量，單位:公噸/年
		CO_EMI: DataTypes.DECIMAL(10,3),	//CO排放量，單位:公噸/年
		PB_EMI: DataTypes.DECIMAL(10,3),	//PB排放量，單位:公噸/年
		
		COMP_KIND1: DataTypes.STRING(4),	//行業代碼
		WGS84_E: DataTypes.DECIMAL(9,5),	//工廠經度座標(東)
		WGS84_N: DataTypes.DECIMAL(8,5),	//工廠經度座標(北)
		
		ORI_QU1: DataTypes.DECIMAL(7,1),	//排放口/煙囪排氣量(乾基)，單位:Nm3/min (Normal cubic meter標準狀態,即溫度0C,1大氣壓下的體積,單位:立方米)
		DIA: DataTypes.DECIMAL(5,2),	//假設之排放口/煙囪等效內徑，單位:公尺
		HEI: DataTypes.DECIMAL(5,1),	//假設之排放口/煙囪高，單位:公尺
		TEMP: DataTypes.DECIMAL(4,0),	//假設之排放口/煙囪排氣溫度，單位:度C
		VEL: DataTypes.DECIMAL(4,1),	//假設之排放口/煙囪排氣速度，單位:公尺/秒
		ASSUME_Q: DataTypes.STRING(1),	//排氣量為假設標記
		ASSUME_D: DataTypes.STRING(1),	//內徑為假設標記
		ASSUME_H: DataTypes.STRING(1),	//煙囪高為假設標記
		ASSUME_T: DataTypes.STRING(1),	//排氣溫度為假設標記
		ASSUME_V: DataTypes.STRING(1),	//排氣速度為假設標記

		NO_S: DataTypes.STRING(4),	//相對應之污染排放口
		ASSUME_HD: DataTypes.STRING(1),	//"小時/日"操作時間假設標記
		HD1: DataTypes.DECIMAL(2,0),	//小時/日
		ASSUME_DW: DataTypes.STRING(1),	//"日/週"操作時間假設標記
		DW1: DataTypes.DECIMAL(1,0),	//日/週
		ASSUME_WY: DataTypes.STRING(1),	//"週/年"操作時間假設標記
		WY1: DataTypes.DECIMAL(2,0),	//週/年

		F_N1: DataTypes.STRING(6),	//物料類別，單位採用SCC計算所採用單位
		F_Q1: DataTypes.DECIMAL(20,1),	//物料年用量
		UNIT: DataTypes.STRING(16),	//物料單位
		U_NAME: DataTypes.STRING(20),	//物料名稱
		S1: DataTypes.DECIMAL(6,2),	//含硫份，單位:%
		A1: DataTypes.DECIMAL(6,2),	//含灰份，單位:%

		EQ_1: DataTypes.STRING(4),	//控制設備編碼1
		A_NAME1: DataTypes.STRING(20),	//控制設備名稱1
		EQ_2: DataTypes.STRING(4),	//控制設備編碼2
		A_NAME2: DataTypes.STRING(20),	//控制設備名稱2
		EQ_3: DataTypes.STRING(4),	//控制設備編碼3
		A_NAME3: DataTypes.STRING(20),	//控制設備名稱3
		EQ_4: DataTypes.STRING(4),	//控制設備編碼4
		A_NAME4: DataTypes.STRING(20),	//控制設備名稱4
		EQ_5: DataTypes.STRING(4),	//控制設備編碼5
		A_NAME5: DataTypes.STRING(20),	//控制設備名稱5

		TSP_EFF: DataTypes.DECIMAL(5,2),	//粒狀物控制效率，0~100
		SOX_EFF: DataTypes.DECIMAL(5,2),	//SOx控制效率，0~100
		NOX_EFF: DataTypes.DECIMAL(5,2),	//NOx控制效率，0~100
		THC_EFF: DataTypes.DECIMAL(5,2),	//THC控制效率，0~100
		CO_EFF: DataTypes.DECIMAL(5,2),	//CO控制效率，0~100
		PB_EFF: DataTypes.DECIMAL(5,2),	//Pb控制效率，0~100

		ID_AREA: DataTypes.STRING(3),	//工業區代碼
		COMP_NAM: DataTypes.STRING(40),	//工廠名稱
		ZS: DataTypes.DECIMAL(9,0),	//地表高程
		TSP_RANK: DataTypes.STRING(5),	//TSP排放量評等，A~U
		SOX_RANK: DataTypes.STRING(5),	//SOx排放量評等，A~U
		NOX_RANK: DataTypes.STRING(5),	//NOx排放量評等，A~U
		VOC_RANK: DataTypes.STRING(5),	//VOC排放量評等，A~U
		CO_RANK: DataTypes.STRING(5),	//CO排放量評等，A~U
		PB_RANK: DataTypes.STRING(5),	//PB排放量評等，A~U
	}, {timestamps: false});
};