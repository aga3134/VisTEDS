module.exports = function(sequelize, DataTypes) {
	return sequelize.define("bioGrid", {
	  	SERIAL_NO: {	//序號
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		LEVEL: DataTypes.INTEGER, 	//網格密度1~6
		GRID_X: DataTypes.INTEGER,	//網格X座標
		GRID_Y: DataTypes.INTEGER,	//網格Y座標

		TOTAL_NMHC: DataTypes.FLOAT,	//總非甲烷碳氫有機氣體排放量(下列各氣體加總)，單位:公噸/年
		ISO: DataTypes.FLOAT,	//異戊二烯(Isoprene)排放量，單位:公噸/年
		MONO: DataTypes.FLOAT,	//單帖類(Monoterpenes)排放量，單位:公噸/年
		ONMHC: DataTypes.FLOAT,	//其他非甲烷碳氫有機氣體排放量，單位:公噸/年
		MBO: DataTypes.FLOAT,	//Methyl-Buten-Ol排放量，單位:公噸/年
	}, {timestamps: false});
};