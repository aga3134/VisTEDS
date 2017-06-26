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
		
		TSP_EMI: DataTypes.FLOAT,	//TSP(總懸浮微粒)排放量，單位:公噸/年
		PM_EMI: DataTypes.FLOAT,	//PM10排放量，單位:公噸/年
		PM6_EMI: DataTypes.FLOAT,	//PM6排放量，單位:公噸/年
		PM25_EMI: DataTypes.FLOAT,	//PM2.5排放量，單位:公噸/年
		SOX_EMI: DataTypes.FLOAT,	//SOx排放量，單位:公噸/年
		NOX_EMI: DataTypes.FLOAT,	//NOx排放量，單位:公噸/年
		THC_EMI: DataTypes.FLOAT,	//THC(總碳氫有機氣體)排放量，單位:公噸/年
		NMHC_EMI: DataTypes.FLOAT,	//NMHC(非甲烷總烴)排放量，單位:公噸/年
		CO_EMI: DataTypes.FLOAT,	//CO排放量，單位:公噸/年
		PB_EMI: DataTypes.FLOAT,	//PB排放量，單位:公噸/年
		
		COMP_KIND1: DataTypes.STRING(4),	//行業代碼
		WGS84_E: DataTypes.FLOAT,	//工廠經度座標(東)
		WGS84_N: DataTypes.FLOAT,	//工廠經度座標(北)
		
		ORI_QU1: DataTypes.FLOAT,	//排放口/煙囪排氣量(乾基)，單位:Nm3/min (Normal cubic meter標準狀態,即溫度0C,1大氣壓下的體積,單位:立方米)
		DIA: DataTypes.FLOAT,	//假設之排放口/煙囪等效內徑，單位:公尺
		HEI: DataTypes.FLOAT,	//假設之排放口/煙囪高，單位:公尺
		TEMP: DataTypes.FLOAT,	//假設之排放口/煙囪排氣溫度，單位:度C
		VEL: DataTypes.FLOAT,	//假設之排放口/煙囪排氣速度，單位:公尺/秒
		ASSUME_Q: DataTypes.STRING(1),	//排氣量為假設標記
		ASSUME_D: DataTypes.STRING(1),	//內徑為假設標記
		ASSUME_H: DataTypes.STRING(1),	//煙囪高為假設標記
		ASSUME_T: DataTypes.STRING(1),	//排氣溫度為假設標記
		ASSUME_V: DataTypes.STRING(1),	//排氣速度為假設標記

		NO_S: DataTypes.STRING(4),	//相對應之污染排放口
		ASSUME_HD: DataTypes.STRING(1),	//"小時/日"操作時間假設標記
		HD1: DataTypes.INTEGER,	//小時/日
		ASSUME_DW: DataTypes.STRING(1),	//"日/週"操作時間假設標記
		DW1: DataTypes.INTEGER,	//日/週
		ASSUME_WY: DataTypes.STRING(1),	//"週/年"操作時間假設標記
		WY1: DataTypes.INTEGER,	//週/年

		F_N1: DataTypes.STRING(6),	//物料類別，單位採用SCC計算所採用單位
		F_Q1: DataTypes.FLOAT,	//物料年用量
		UNIT: DataTypes.STRING(16),	//物料單位
		U_NAME: DataTypes.STRING(20),	//物料名稱
		S1: DataTypes.FLOAT,	//含硫份，單位:%
		A1: DataTypes.FLOAT,	//含灰份，單位:%

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

		TSP_EFF: DataTypes.FLOAT,	//粒狀物控制效率，0~100
		SOX_EFF: DataTypes.FLOAT,	//SOx控制效率，0~100
		NOX_EFF: DataTypes.FLOAT,	//NOx控制效率，0~100
		THC_EFF: DataTypes.FLOAT,	//THC控制效率，0~100
		CO_EFF: DataTypes.FLOAT,	//CO控制效率，0~100
		PB_EFF: DataTypes.FLOAT,	//Pb控制效率，0~100

		ID_AREA: DataTypes.STRING(3),	//工業區代碼
		COMP_NAM: DataTypes.STRING(40),	//工廠名稱
		ZS: DataTypes.FLOAT,	//地表高程
		TSP_RANK: DataTypes.STRING(5),	//TSP排放量評等，A~U
		SOX_RANK: DataTypes.STRING(5),	//SOx排放量評等，A~U
		NOX_RANK: DataTypes.STRING(5),	//NOx排放量評等，A~U
		VOC_RANK: DataTypes.STRING(5),	//VOC排放量評等，A~U
		CO_RANK: DataTypes.STRING(5),	//CO排放量評等，A~U
		PB_RANK: DataTypes.STRING(5),	//PB排放量評等，A~U
	}, {timestamps: false});
};