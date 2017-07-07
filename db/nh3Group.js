module.exports = function(sequelize, DataTypes) {
	return sequelize.define("nh3group", {
	  	SERIAL_NO: {	//序號
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		WGS84_E: DataTypes.DECIMAL(9,5),	//工廠經度座標(東)
		WGS84_N: DataTypes.DECIMAL(8,5),	//工廠經度座標(北)

		EM_NH3: DataTypes.FLOAT,	//NH3排放量，單位:公噸/年
	}, {timestamps: false});
};