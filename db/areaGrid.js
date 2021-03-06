module.exports = function(sequelize, DataTypes) {
	return sequelize.define("areagrid", {
	  	SERIAL_NO: {	//序號
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		LEVEL: DataTypes.INTEGER, 	//網格密度1~6
		GRID_X: DataTypes.INTEGER,	//網格X座標
		GRID_Y: DataTypes.INTEGER,	//網格Y座標

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