import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";

import * as amqp from "amqplib";

import { RabbitExchange, RabbitQueue } from "./rabbit.constants";

@Injectable()
export class RabbitService implements OnModuleInit, OnModuleDestroy {
  private connection!: amqp.ChannelModel;
  private channel!: amqp.Channel;

  private ready!: Promise<void>;
  private resolve!: () => void;

  async onModuleInit() {
    this.connection = await amqp.connect(process.env.RABBITMQ_URL!);

    this.channel = await this.connection.createChannel();

    await this.channel.assertExchange(RabbitExchange.EVENTS, "topic", {
      durable: true,
    });

    await this.channel.assertQueue(RabbitQueue.STUDY, {
      durable: true,
    });

    await this.channel.assertQueue(RabbitQueue.INFERENCE, {
      durable: true,
    });

    await this.channel.bindQueue(RabbitQueue.STUDY, RabbitExchange.EVENTS, "study.*");

    await this.channel.bindQueue(RabbitQueue.INFERENCE, RabbitExchange.EVENTS, "inference.*");
  }

  async getChannel(): Promise<amqp.Channel> {
    await this.ready;
    return this.channel;
  }

  async onModuleDestroy() {
    await this.channel.close();
    await this.connection.close();
  }
}
