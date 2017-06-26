module.exports = function(sequelize, DataTypes) {
	return sequelize.define("areaSource", {
	  	SERIAL_NO: {	//序號
			type: DataTypes.INTEGER,
			primaryKey: true
		},
		NSC: DataTypes.STRING(6),	//面源汙染代碼
		NSC_SUB: DataTypes.STRING(1),	//面源汙染副碼
		WGS84_E: DataTypes.FLOAT,	//經度座標(東)
		WGS84_N: DataTypes.FLOAT,	//緯度座標(北)
		DICT: DataTypes.STRING(4),	//鄉鎮代碼
		EM_TSP: DataTypes.FLOAT,	//TSP排放量，單位:公噸/年
		EM_PM: DataTypes.FLOAT,	//PM10排放量，單位:公噸/年
		EM_PM6: DataTypes.FLOAT,	//PM6排放量，單位:公噸/年
		EM_PM25: DataTypes.FLOAT,	//PM2.5排放量，單位:公噸/年
		EM_SOX: DataTypes.FLOAT,	//硫氧化物排放量，單位:公噸/年
		EM_NOX: DataTypes.FLOAT,	//氮氧化物排放量，單位:公噸/年
		EM_THC: DataTypes.FLOAT,	//總碳氫化合物排放量，單位:公噸/年
		EM_NMHC: DataTypes.FLOAT,	//非甲烷碳氫化合物排放量，單位:公噸/年
		EM_CO: DataTypes.FLOAT,	//一氧化碳排放量，單位:公噸/年
		EM_PB: DataTypes.FLOAT,	//鉛排放量，單位:公噸/年
		EM_NH3: DataTypes.FLOAT,	//氨排放量，單位:公噸/年
	}, {timestamps: false});
};