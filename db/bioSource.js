module.exports = function(sequelize, DataTypes) {
	return sequelize.define("bioSource", {
	  	SERIAL_NO: {	//序號
			type: DataTypes.INTEGER,
			primaryKey: true
		},
		WGS84_E: DataTypes.FLOAT,	//經度座標(東)
		WGS84_N: DataTypes.FLOAT,	//緯度座標(北)
		
		TOTAL_NMHC: DataTypes.FLOAT,	//總揮發性有機物(VOC)排放量(下列各VOC加總)，單位:公噸/年
		ISO: DataTypes.FLOAT,	//異戊二烯(Isoprene)排放量，單位:公噸/年
		MONO: DataTypes.FLOAT,	//單帖類(Monoterpenes)排放量，單位:公噸/年
		ONMHC: DataTypes.FLOAT,	//其他VOC排放量，單位:公噸/年
		MBO: DataTypes.FLOAT,	//Methyl-Buten-Ol排放量，單位:公噸/年
	}, {timestamps: false});
};