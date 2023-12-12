const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

const handleBit = (e) => {
    e.preventDefault();
    helper.hideError();

    // grabbing values from the form to send to the server so it creates the bit
    const message = e.target.querySelector('#bitMessageForm').value;

    if(!message) {
        helper.handleError('A message is required!');
        return false;
    }

    helper.sendPost(e.target.action, {message}, loadBitsFromServer);

    return false;
}

const likeBit = (e, _id) => {
    e.preventDefault();
    helper.hideError();

    helper.sendPost(e.target.action, {_id}, loadBitsFromServer);

    return false;
}

const reBit = (e, _id) => {
    e.preventDefault();
    helper.hideError();

    helper.sendPost(e.target.action, {_id}, loadBitsFromServer);

    return false;
}

const swap = (e) => {
    e.preventDefault();
    helper.hideError();

    helper.sendPost(e.target.action);

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
            <label htmlFor="message">Message: </label>
            <input id="bitMessageForm" type="text" placeholder="Bit Message" />
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
                <h3 className="bitName"> Name: {bit.name} </h3>
                <h3 className="bitMessageFormForm"> Message: {bit.message} </h3>
                <label htmlFor="likes">Likes: </label>
                <h3 id="bitLikes"> {bit.likes} </h3>

                <form
                    onSubmit={(e) => likeBit(e, bit._id)}
                    name="likeBitForm"
                    action="like"
                    method="POST"
                    classname="likeBitForm"
                >

                <input className="likeBitSubmit" type="submit" value="Like Bit" />

                </form>

                <h3 className="bitRebits"> Rebits: {bit.rebits} </h3>

                <form
                    onSubmit={(e) => reBit(e, bit._id)}
                    name="reBitForm"
                    action="rebit"
                    method="POST"
                    classname="reBitForm"
                >

                <input className="reBitSubmit" type="submit" value="Rebit" />

                </form>

                <h3 className="bitDate"> Date: {bit.createdDate} </h3>
            </div>
        );
    });

    return (
        <div className="bitList">
            {bitNodes}
        </div>
    );
}

const Ads = () => {
    return (
        <div class="wrapper">
            <div class="banner">AD HERE! Premium button is supposed to make 
            this appear and dissapear and reappear with the account's premium 
            status</div>
            <div class="head"></div>
            <div class="content"></div>
        </div>
    );
}

const Premium = () => {
    return (
        <form
            onSubmit={(e) => swap(e)}
            name="premiumBtn"
            action="premium"
            method="POST"
            classname="premiumBtn"
        >

        <input id="premiumButton" className="premiumSubmit" type="submit" value="Premium" />

        </form>
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
    const premiumButton = document.getElementById('premiumButton');

    ReactDOM.render(
        <BitForm />,
        document.getElementById('makeBit')
    );

    ReactDOM.render(
        <BitList bits={[]} />,
        document.getElementById('bits')
    );

    ReactDOM.render(
        <Premium />,
        document.getElementById('premium')
    );

    ReactDOM.render(
        <Ads />,
        document.getElementById('ads')
    );

    loadBitsFromServer();
}

window.onload = init;