export const produceMessage = async (producer, topic, value, key) => {
  key = !key ? `${topic}-1` : key;
  await producer.send({
    topic,
    messages: [{ key: `${topic}`, value }],
  });
  console.log(`${topic} : Message Produced`);
};
