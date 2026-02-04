export interface createTask {
  title: string;
  userId: {
    _id: string;
    username: string;
  };
  image: object;
  description: string;
  deadline: string;
}
export interface TaskData {
  _id: string;
  title: string;
  description: string;
  deadline: string;
  status: string;
  userId: {
    _id: string;
    username: string;
  };
  image: string;
}
