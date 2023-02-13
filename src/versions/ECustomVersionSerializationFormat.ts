enum ECustomVersionSerializationFormat {
  Unknown,
  Guids,
  Enums,
  Optimized,

  CustomVersion_Automatic_Plus_One,
  Latest = CustomVersion_Automatic_Plus_One - 1
};

export default ECustomVersionSerializationFormat;
