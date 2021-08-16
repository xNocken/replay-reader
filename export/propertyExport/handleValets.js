const handleValets = ({ chIndex, data, states, result }) => {
  if (!states.valets[chIndex]) {
    states.valets[chIndex] = data;
    result.mapData.valets.push(data);

    return;
  }

  Object.entries(data).forEach(([key, value]) => {
    if (value !== null) {
      states.valets[chIndex][key] = value;
    }
  });
}

module.exports = handleValets;
