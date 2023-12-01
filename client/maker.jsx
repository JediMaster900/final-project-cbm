const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

const handleBit = (e) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#bitName').value;
    const message = e.target.querySelector('#bitMessage').value;
    const likes = e.target.querySelector('#bitLikes').value;
    const rebits = e.target.querySelector('#bitRebits').value;
    const date = e.target.querySelector('#bitDate').value;

    if(!message) {
        helper.handleError('A message is required!');
        return false;
    }

    helper.sendPost(e.target.action, {name, message, likes, rebits}, loadBitsFromServer);

    return false;
}

const BitForm = (props) => {
    return (
        <form
            onSubmit={handleBit}
            name="bitForm"
            action="maker"
            method="POST"
            className="bitForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="bitName" type="text" name="name" placeholder="Bit Name" />
            <label htmlFor="message">Message: </label>
            <input id="bitMessage" type="text" min="0" name="message" />
            <input className="makeBitSubmit" type="submit" value="Make Bit" />

        </form>
    );
}

const BitList = (props) => {
    if(props.bits.length === 0) {
        return (
            <div className="bitList">
                <h3 className="emptyBit">No Bits Yet!</h3>
            </div>
        );
    }

    const bitNodes = props.bits.map(bit => {
        return (
            <div key={bit._id} className="bit">
                <img src="/assets/img/domoface.jpeg" alt="bit face" className="bitFace" />
                <h3 className="bitName"> Name: {bit.name} </h3>
                <h3 className="bitMessage"> Message: {bit.message} </h3>
                <h3 className="bitLikes"> Likes: {bit.likes} </h3>
                <h3 className="bitRebits"> Rebits: {bit.rebits} </h3>
                <h3 className="bitDate"> Date: {bit.date} </h3>
            </div>
        );
    });

    return (
        <div className="bitList">
            {bitNodes}
        </div>
    );
}

const loadBitsFromServer = async () => {
    const response = await fetch('/getBits');
    const data = await response.json();
    ReactDOM.render(
        <BitList bits={data.bits} />,
        document.getElementById('bits')
    );
}

const init = () => {
    ReactDOM.render(
        <BitForm />,
        document.getElementById('makeBit')
    );

    ReactDOM.render(
        <BitList bits={[]} />,
        document.getElementById('bits')
    );

    loadBitsFromServer();
}

window.onload = init;