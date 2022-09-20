import { User, WateringEvent } from '../../db/models';
import { NextApiResponse, NextApiRequest } from 'next';
import { performance } from 'perf_hooks';

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const t0 = performance.now();

  try {
    const token = request.headers['authorization'];
    if (!token) {
      return response.status(200).json({ events: [] });
    }

    const user = await User.findOne({
      where: {
        token,
      },
    });

    if (!user) {
      return response.status(200).json({ events: [] });
    }

    if (request.method === 'POST') {
      const { isWatered, wateringDateField } = request.body;

      const [event, created]: [any, boolean] = await WateringEvent.findOrCreate({
        where: { date: wateringDateField },
        defaults: {
          done: false,
        },
      });

      console.log('FIND OR CREATE EVENTS >>>', performance.now() - t0);
      const t1 = performance.now();

      event.done = isWatered;
      await event.save();
      console.log('SAVE EVENT >>>', performance.now() - t1);

      return response.status(200).json({ event: event.id });
    } else {
      const events = await WateringEvent.findAll();

      console.log('GET ALL EVENTS >>>', performance.now() - t0);

      return response.status(200).json({ events });
    }
  } catch (error) {
    // console.error('Unable to connect to the database:', error);
  }
  response.status(200).json({ name: 'John Doe' });
}
