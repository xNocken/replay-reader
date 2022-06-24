const handleLlama = ({ actorId, data, result, states, changedProperties }) => {
  let llama = states.llamas[actorId];

  if (!llama) {
    llama = {};

    result.mapData.llamas.push(llama);
    states.llamas[actorId] = llama;
  }

  for (let i = 0; i < changedProperties.length; i += 1) {
    const key = changedProperties[i];

    llama[key] = data[key];
  }
};

module.exports = handleLlama;
