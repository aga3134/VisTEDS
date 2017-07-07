module.exports = function(sequelize, DataTypes) {
	return sequelize.define("sumgrid", {
	  	SERIAL_NO: {	//序號
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		LEVEL: DataTypes.INTEGER, 	//網格密度1~6
		GRID_X: DataTypes.INTEGER,	//網格X座標
		GRID_Y: DataTypes.INTEGER,	//網格Y座標

		TSP: DataTypes.FLOAT,	//TSP排放量，單位:公噸/年
		PM: DataTypes.FLOAT,	//PM10排放量，單位:公噸/年
		PM6: DataTypes.FLOAT,	//PM6排放量，單位:公噸/年
		PM25: DataTypes.FLOAT,	//PM2.5排放量，單位:公噸/年
		SOX: DataTypes.FLOAT,	//硫氧化物排放量，單位:公噸/年
		NOX: DataTypes.FLOAT,	//氮氧化物排放量，單位:公噸/年
		THC: DataTypes.FLOAT,	//總碳氫化合物排放量，單位:公噸/年
		NMHC: DataTypes.FLOAT,	//非甲烷碳氫化合物排放量，單位:公噸/年
		CO: DataTypes.FLOAT,	//一氧化碳排放量，單位:公噸/年
		PB: DataTypes.FLOAT,	//鉛排放量，單位:公噸/年
	}, {timestamps: false});
};