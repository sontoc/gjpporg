import { 
  collection, 
  doc, 
  addDoc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  serverTimestamp, 
  Timestamp 
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

export interface Event {
  id: string;
  title: string;
  type: 'event' | 'campaign';
  description: string;
  status: 'scheduled' | 'active' | 'completed';
  startDate: string;
  endDate: string;
  time: string;
  location: string;
  imageUrl?: string;
  authorId: string;
  authorName: string;
  createdAt: any;
  updatedAt: any;
}

export interface Rsvp {
  id?: string;
  eventId: string;
  name: string;
  phone: string;
  email: string;
  message?: string;
  userId?: string;
  createdAt: any;
}

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error Details: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

import { INITIAL_EVENTS } from '../constants';

const getLocals = (): Event[] => {
  try {
    const saved = localStorage.getItem('local_events');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveLocals = (events: Event[]) => {
  try {
    localStorage.setItem('local_events', JSON.stringify(events));
  } catch (err) {
    console.error(err);
  }
};

const getLocalRsvps = (): Rsvp[] => {
  try {
    const saved = localStorage.getItem('local_rsvps');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveLocalRsvps = (rsvps: Rsvp[]) => {
  try {
    localStorage.setItem('local_rsvps', JSON.stringify(rsvps));
  } catch (err) {
    console.error(err);
  }
};

const mergeEvents = (dbEvents: Event[]): Event[] => {
  const locals = getLocals();
  const merged = [...dbEvents];
  
  locals.forEach(local => {
    if (!merged.some(m => m.id === local.id)) {
      merged.push(local);
    }
  });

  INITIAL_EVENTS.forEach((init: any) => {
    if (!merged.some(m => m.id === init.id)) {
      merged.push({
        ...init,
        createdAt: init.createdAt,
        updatedAt: init.updatedAt
      });
    }
  });

  return merged.filter(e => e.id !== 'evt-1' && e.id !== 'evt-2' && e.id !== 'evt-3');
};

export const eventService = {
  // Fetch all events sorted by start date or creation
  getEvents: async (): Promise<Event[]> => {
    const path = 'events';
    try {
      const q = query(collection(db, path), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const events: Event[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        events.push({
          id: docSnap.id,
          title: data.title || '',
          type: data.type || 'event',
          description: data.description || '',
          status: data.status || 'active',
          startDate: data.startDate || '',
          endDate: data.endDate || '',
          time: data.time || '',
          location: data.location || '',
          imageUrl: data.imageUrl || '',
          authorId: data.authorId || '',
          authorName: data.authorName || '관리자',
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        });
      });
      return mergeEvents(events);
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch (err) {}
      return mergeEvents([]);
    }
  },

  // Create an event
  createEvent: async (eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    const docId = 'event_' + Math.random().toString(36).substring(2, 11);
    const path = `events/${docId}`;
    
    const locals = getLocals();
    const newEvent: Event = {
      id: docId,
      ...eventData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as any;
    locals.unshift(newEvent);
    saveLocals(locals);

    try {
      const payload = {
        ...eventData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      await setDoc(doc(db, 'events', docId), payload);
      return docId;
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.CREATE, path);
      } catch (err) {}
      return docId;
    }
  },

  // Update an event
  updateEvent: async (eventId: string, eventData: Partial<Event> & { authorId: string }): Promise<void> => {
    const path = `events/${eventId}`;
    
    const locals = getLocals();
    const index = locals.findIndex(e => e.id === eventId);
    if (index >= 0) {
      locals[index] = {
        ...locals[index],
        ...eventData,
        updatedAt: new Date().toISOString() as any
      };
      saveLocals(locals);
    }

    try {
      const docRef = doc(db, 'events', eventId);
      const updatePayload = {
        ...eventData,
        updatedAt: serverTimestamp(),
      };
      delete (updatePayload as any).id;
      delete (updatePayload as any).createdAt;

      await updateDoc(docRef, updatePayload);
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.UPDATE, path);
      } catch (err) {}
    }
  },

  // Delete an event
  deleteEvent: async (eventId: string): Promise<void> => {
    const path = `events/${eventId}`;
    
    const locals = getLocals().filter(e => e.id !== eventId);
    saveLocals(locals);

    try {
      await deleteDoc(doc(db, 'events', eventId));
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.DELETE, path);
      } catch (err) {}
    }
  },

  // Submit RSVP registration
  submitRsvp: async (eventId: string, rsvpData: Omit<Rsvp, 'id' | 'createdAt'>): Promise<string> => {
    const rsvpId = 'rsvp_' + Math.random().toString(36).substring(2, 11);
    const path = `events/${eventId}/rsvps/${rsvpId}`;
    
    const localRsvps = getLocalRsvps();
    const newRsvp: Rsvp = {
      id: rsvpId,
      ...rsvpData,
      createdAt: new Date().toISOString()
    };
    localRsvps.unshift(newRsvp);
    saveLocalRsvps(localRsvps);

    try {
      const payload = {
        ...rsvpData,
        createdAt: serverTimestamp(),
      };
      await setDoc(doc(db, 'events', eventId, 'rsvps', rsvpId), payload);
      return rsvpId;
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.CREATE, path);
      } catch (err) {}
      return rsvpId;
    }
  },

  // Fetch RSVPs for an event (Admins only)
  getRsvps: async (eventId: string): Promise<Rsvp[]> => {
    const path = `events/${eventId}/rsvps`;
    try {
      const q = query(collection(db, 'events', eventId, 'rsvps'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const rsvps: Rsvp[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        rsvps.push({
          id: docSnap.id,
          eventId: data.eventId,
          name: data.name || '',
          phone: data.phone || '',
          email: data.email || '',
          message: data.message || '',
          userId: data.userId || '',
          createdAt: data.createdAt,
        });
      });

      const locals = getLocalRsvps().filter(r => r.eventId === eventId);
      const merged = [...rsvps];
      locals.forEach(local => {
        if (!merged.some(m => m.id === local.id)) {
          merged.push(local);
        }
      });
      return merged;
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch (err) {}
      return getLocalRsvps().filter(r => r.eventId === eventId);
    }
  }
};
