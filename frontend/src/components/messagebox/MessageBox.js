import Alert from 'react-bootstrap/Alert';

export default function MessageBox(props) {
    return <Alert variant={props.variant || 'info'} style={{opacity: 1}}>{props.children}</Alert>;
}