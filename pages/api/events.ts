import { WateringEvent } from '../../db/models';
import { NextApiResponse, NextApiRequest } from 'next';

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const token = request.headers['TOKEN'];
    if (!token) {
      // return response.status(403).json({ token: 'Please provide token' });
    }

    if (request.method === 'POST') {
      await new Promise((resolve) => {
        setTimeout(() => resolve(true), 1000);
      });

      const { isWatered, wateringDateField } = request.body;

      const [event, created]: [any, boolean] = await WateringEvent.findOrCreate({
        where: { date: wateringDateField },
        defaults: {
          done: false,
        },
      });

      event.done = isWatered;
      await event.save();

      return response.status(200).json({ event: event.id });
    } else {
      const events = await WateringEvent.findAll();

      return response.status(200).json({ events });
    }
  } catch (error) {
    // console.error('Unable to connect to the database:', error);
  }
  response.status(200).json({ name: 'John Doe' });
}
