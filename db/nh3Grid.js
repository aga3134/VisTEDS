module.exports = function(sequelize, DataTypes) {
	return sequelize.define("nh3Grid", {
	  	SERIAL_NO: {	//序號
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		LEVEL: DataTypes.INTEGER, 	//網格密度1~6
		GRID_X: DataTypes.INTEGER,	//網格X座標
		GRID_Y: DataTypes.INTEGER,	//網格Y座標

		EM_NH3: DataTypes.FLOAT,	//NH3排放量，單位:公噸/年
	}, {timestamps: false});
};