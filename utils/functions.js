export const produceMessage = async (producer, topic, message) => {
  await producer.send({
    topic,
    messages: [message],
  });
  console.log(`${topic} : Messages Produced`);
};
