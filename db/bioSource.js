module.exports = function(sequelize, DataTypes) {
	return sequelize.define("bioSource", {
	  	SERIAL_NO: {	//序號
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		WGS84_E: DataTypes.DECIMAL(9,5),	//工廠經度座標(東)
		WGS84_N: DataTypes.DECIMAL(8,5),	//工廠經度座標(北)
		
		TOTAL_NMHC: DataTypes.DECIMAL(10,6),	//總非甲烷碳氫有機氣體排放量(下列各VOC加總)，單位:公噸/年
		ISO: DataTypes.DECIMAL(10,6),	//異戊二烯(Isoprene)排放量，單位:公噸/年
		MONO: DataTypes.DECIMAL(10,6),	//單帖類(Monoterpenes)排放量，單位:公噸/年
		ONMHC: DataTypes.DECIMAL(10,6),	//其他非甲烷碳氫有機氣體排放量，單位:公噸/年
		MBO: DataTypes.DECIMAL(10,6),	//甲基-丁烯-醇(Methyl-Buten-Ol)排放量，單位:公噸/年
	}, {timestamps: false});
};