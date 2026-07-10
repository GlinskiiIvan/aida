import { Badge } from '../ui/copmonents';

export const testClickHandler = () => {
    alert('Test click on component!');
};

export const patientInfoList = [
  {key: 'Patient name', value: 'John Doe'}, 
  {key: 'Patient ID', value: '63048393'},
  {key: 'Gender', value: 'Male'},
  {key: 'Age', value: '32 years'},
  {key: 'Date of birth', value: '12 Mar 1994'},
  {key: 'Status', value: <Badge text='Normal' size='sm' status='success' />},
];

export const testMessages = ['message 1', 'message 2', 'message 3'];