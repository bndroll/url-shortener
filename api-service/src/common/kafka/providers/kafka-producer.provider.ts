import { ClientKafka } from '@nestjs/microservices';

export const KafkaProducerProvider = {
  provide: 'KAFKA_PRODUCER',
  useFactory: async (client: ClientKafka) => {
    return client.connect();
  },
  inject: ['API_SERVICE'],
};