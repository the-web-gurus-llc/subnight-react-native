import React, {
    Component
} from "react";
import {
    View,
} from "react-native";
import { connect } from 'react-redux';
import Config from './../../Config/Config'
import Ws from '@adonisjs/websocket-client'

const TAG = "ChatSocket: "

class ChatSocket extends Component {
    constructor(props) {
        super(props);

    }

    componentDidMount() {
        this.ws = Ws(Config.wsUrl);
        this.ws.on('open', this.onSocketConnect);

        this.ws.on('close', () => {
            this.user = null
            console.log(TAG, 'socket closed');
        })

        this.ws.withJwtToken(this.props.userToken.token).connect()
    }

    onSocketConnect = () => {
        console.log(TAG, 'socket connected')
        this.user = this.props.userToken.user
        this.listenTopicChat()
    }

    listenTopicChat() {
        try {
            this.topicChat = this.ws.getSubscription(`chat:${this.props.userToken.user._id}`)
            if (this.topicChat) return true
            this.topicChat = this.ws.subscribe(`chat:${this.props.userToken.user._id}`)

            this.topicChat.on('ready', () => {
                console.log(TAG, 'topic chat connected')
                this.user = this.props.userToken.user
            })

            this.topicChat.on('new:message', this.onNewMessage)
            this.topicChat.on('new:comment', this.onNewComment)
            this.topicChat.on('new:conversation', this.onNewConversation)
            this.topicChat.on('update:conversation', this.onUpdateConversation)
            this.topicChat.on('accept:conversation', this.onAcceptConversation)
            this.topicChat.on('reject:conversation', this.onRejectConversation)
            this.topicChat.on('read:message', this.onSeenMessage)
            this.topicChat.on('read:conversation', this.onSeenConversation)
            this.topicChat.on('follow:update', this.pushUpdateFollow)
            this.topicChat.on('reservation:update', this.onUpdateReservation)

            this.topicChat.on('error', (error) => {
                console.log(TAG, error)
            })

            this.topicChat.on('close', () => {
                this.user = null
                console.log(TAG, 'topic chat closed')
            })
        } catch (error) {
            console.log(TAG, 'error while connect to topic chat', error)
        }
    }

    componentWillUnmount() {
        if (this.topicChat) {
            this.topicChat.off('new:message', this.onNewMessage)
            this.topicChat.off('new:comment', this.onNewComment)
            this.topicChat.off('new:conversation', this.onNewConversation)
            this.topicChat.off('update:conversation', this.onUpdateConversation)
            this.topicChat.off('accept:conversation', this.onAcceptConversation)
            this.topicChat.off('reject:conversation', this.onRejectConversation)
            this.topicChat.off('read:message', this.onSeenMessage)
            this.topicChat.off('read:conversation', this.onSeenConversation)
            this.topicChat.off('friend:update', this.pushUpdateFollow)
            this.topicChat.off('reservation:update', this.onUpdateReservation)
            this.topicChat.close()
        }
        this.ws && this.ws.close()
    }

    onNewMessage = (data) => {
        const { message, badge } = data
        // this.props.message.receiveMessage(message, badge)
        this.props.onReceiveMessage(message)
    }

    onNewComment = ({ comment }) => {
    }

    onNewConversation = (data) => {
    }

    onUpdateConversation = (data) => {
    }

    onAcceptConversation = (data) => {
    }

    onRejectConversation = (data) => {
    }

    onSeenMessage = (data) => {
    }

    onSeenConversation = (data) => {
    }

    pushUpdateFollow = (data) => {
    }

    onUpdateReservation = ({ reservation }) => {
    }

    render() {
        return (
            <View />
        )
    }

}

const mapStateToProps = (state) => {
    return {
        profile: state.user.profile,
        userToken: state.startup.userToken
    }
};

export default connect(mapStateToProps)(ChatSocket)