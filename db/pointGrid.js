module.exports = function(sequelize, DataTypes) {
	return sequelize.define("pointgrid", {
	  	SERIAL_NO: {	//序號
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		LEVEL: DataTypes.INTEGER, 	//網格密度1~6
		GRID_X: DataTypes.INTEGER,	//網格X座標
		GRID_Y: DataTypes.INTEGER,	//網格Y座標

		TSP_EMI: DataTypes.FLOAT,	//TSP(總懸浮微粒)排放量，單位:公噸/年
		PM_EMI: DataTypes.FLOAT,	//PM10排放量，單位:公噸/年
		PM6_EMI: DataTypes.FLOAT,	//PM6排放量，單位:公噸/年
		PM25_EMI: DataTypes.FLOAT,	//PM2.5排放量，單位:公噸/年
		SOX_EMI: DataTypes.FLOAT,	//SOx排放量，單位:公噸/年
		NOX_EMI: DataTypes.FLOAT,	//NOx排放量，單位:公噸/年
		THC_EMI: DataTypes.FLOAT,	//THC(總碳氫有機氣體)排放量，單位:公噸/年
		NMHC_EMI: DataTypes.FLOAT,	//NMHC(非甲烷碳氫有機氣體)排放量，單位:公噸/年
		CO_EMI: DataTypes.FLOAT,	//CO排放量，單位:公噸/年
		PB_EMI: DataTypes.FLOAT,	//PB排放量，單位:公噸/年
	}, {timestamps: false});
};