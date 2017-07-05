module.exports = function(sequelize, DataTypes) {
	return sequelize.define("areaSource", {
	  	SERIAL_NO: {	//序號
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		NSC: DataTypes.STRING(6),	//面源汙染代碼
		NSC_SUB: DataTypes.STRING(1),	//面源汙染副碼
		WGS84_E: DataTypes.DECIMAL(9,5),	//工廠經度座標(東)
		WGS84_N: DataTypes.DECIMAL(8,5),	//工廠經度座標(北)
		DICT: DataTypes.STRING(4),	//鄉鎮代碼
		EM_TSP: DataTypes.DECIMAL(10,6),	//TSP排放量，單位:公噸/年
		EM_PM: DataTypes.DECIMAL(10,6),	//PM10排放量，單位:公噸/年
		EM_PM6: DataTypes.DECIMAL(10,6),	//PM6排放量，單位:公噸/年
		EM_PM25: DataTypes.DECIMAL(10,6),	//PM2.5排放量，單位:公噸/年
		EM_SOX: DataTypes.DECIMAL(10,6),	//硫氧化物排放量，單位:公噸/年
		EM_NOX: DataTypes.DECIMAL(10,6),	//氮氧化物排放量，單位:公噸/年
		EM_THC: DataTypes.DECIMAL(10,6),	//總碳氫化合物排放量，單位:公噸/年
		EM_NMHC: DataTypes.DECIMAL(10,6),	//非甲烷碳氫化合物排放量，單位:公噸/年
		EM_CO: DataTypes.DECIMAL(10,6),	//一氧化碳排放量，單位:公噸/年
		EM_PB: DataTypes.DECIMAL(10,6),	//鉛排放量，單位:公噸/年
		EM_NH3: DataTypes.DECIMAL(10,6),	//氨排放量，單位:公噸/年
	}, {timestamps: false});
};