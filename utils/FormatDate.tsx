import moment from "moment";


export default function formatDate(dateItem: Date): string {
  var x = dateItem.toLocaleString();
  var formatted = moment(x).format('MMMM Do YYYY, h:mm:ss a');
  return formatted;
}