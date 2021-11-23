const handleValets = ({ chIndex, data, states, result, changedProperties }) => {
  if (!states.valets[chIndex]) {
    states.valets[chIndex] = data;
    result.mapData.valets.push(data);

    return;
  }

  for (let i = 0; i < changedProperties.length; i += 1) {
    const key = changedProperties[i];

    states.valets[chIndex][key] = data[key];
  }
}

module.exports = handleValets;
