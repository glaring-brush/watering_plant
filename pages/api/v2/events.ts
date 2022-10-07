import { createClient } from '@supabase/supabase-js';
import { NextApiResponse, NextApiRequest } from 'next';
import { performance } from 'perf_hooks';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const t0 = performance.now();

  try {
    const token = request.headers['authorization'];
    if (!token) {
      return response.status(200).json({ events: [] });
    }

    let {
      data: user,
      error: userError,
      status: userStatus,
    } = await supabase.from('Users').select(`username, id`).eq('token', token).single();

    if (!user) {
      return response.status(200).json({ events: [] });
    }

    if (request.method === 'POST') {
      const { isWatered, wateringDateField } = request.body;

      console.log(request.body);

      let {
        data: currentEvents,
        error: currentEventsError,
        status: currentEventsStatus,
      } = await supabase.from('WateringEvents').select(`*`);

      console.log(currentEvents || []);

      let created = false;
      let {
        data: event,
        error: eventError,
        status: eventStatus,
      } = await supabase.from('WateringEvents').select(`done, id`).eq('date', wateringDateField).single();

      if (!event) {
        let {
          data: eventCreated,
          error: eventCreatedError,
          status: eventCreatedStatus,
        } = await supabase.from('WateringEvents').insert([{ date: wateringDateField, done: false }]);

        event = eventCreated[0];
        created = true;
      }

      if (created) {
        console.log('NEW EVENT CREATED ON >>>', wateringDateField);
      }

      console.log('FIND OR CREATE EVENTS >>>', performance.now() - t0);
      const t1 = performance.now();

      // const { data: updateEventData, error: updateEventError } = await supabase
      //   .from('WateringEvents')
      //   .update({ done: true })
      //   .match({ id: event.id });

      console.log('SAVE EVENT >>>', performance.now() - t1);

      return response.status(200).json({ event: event.id });
    } else {
      let {
        data: events,
        error: eventsError,
        status: eventsStatus,
      } = await supabase.from('WateringEvents').select(`*`);

      console.log('GET ALL EVENTS >>>', performance.now() - t0);

      return response.status(200).json({ events });
    }
  } catch (error) {
    // console.error('Unable to connect to the database:', error);
  }
  response.status(200).json({ name: 'John Doe' });
}
