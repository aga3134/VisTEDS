module.exports = function(sequelize, DataTypes) {
	return sequelize.define("nh3Source", {
	  	SERIAL_NO: {	//序號
			type: DataTypes.INTEGER,
			primaryKey: true
		},
		NSC: DataTypes.STRING(6),	//汙染源代碼
		NSC_SUB: DataTypes.STRING(1),	//汙染源副碼
		WGS84_E: DataTypes.FLOAT,	//經度座標(東)
		WGS84_N: DataTypes.FLOAT,	//緯度座標(北)
		DICT: DataTypes.STRING(4),	//鄉鎮代碼
		EM_NH3: DataTypes.FLOAT,	//NH3排放量，單位:公噸/年
	}, {timestamps: false});
};