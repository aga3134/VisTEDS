module.exports = function(sequelize, DataTypes) {
	return sequelize.define("nh3source", {
	  	SERIAL_NO: {	//序號
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		NSC: DataTypes.STRING(6),	//汙染源代碼
		NSC_SUB: DataTypes.STRING(1),	//汙染源副碼
		WGS84_E: DataTypes.DECIMAL(9,5),	//工廠經度座標(東)
		WGS84_N: DataTypes.DECIMAL(8,5),	//工廠經度座標(北)
		DICT: DataTypes.STRING(4),	//鄉鎮代碼
		EM_NH3: DataTypes.FLOAT,	//NH3排放量，單位:公噸/年
	}, {timestamps: false});
};