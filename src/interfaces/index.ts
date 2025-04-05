export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "user" | "salon-owner" | "admin";
  created_at: string;
}

export interface ISalon {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  minimum_service_price: number;
  maximum_service_price: number;
  offer_status: "active" | "inactive";
  latitude: string;
  longitude: string;

  working_days: string[];
  start_time: string;
  end_time: string;
  break_start_time: string;
  break_end_time: string;

  slot_duration: number;
  max_bookings_per_slot: number;

  average_rating: number;
  total_reviews: number;

  owner: IUser;
  created_at: string;
  updated_at: string;
}

export interface IAppointment {
  id: string;
  user_id: string;
  salon_id: string;
  date: string;
  start_time: string;
  end_time: string;
  status: "booked" | "cancelled" | "completed";
  is_review_given: boolean;
  created_at: string;
  updated_at: string;


  // runtime fields
  user: IUser;
  salon: ISalon;
}


export interface IReview {
  id: string;
  user_id: string;
  salon_id: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;

  // runtime fields
  user: IUser;
  salon: ISalon;
}