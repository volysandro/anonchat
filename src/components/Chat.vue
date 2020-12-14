<template>
  <div style="height: 100%; width: 100%; top: 5%;" class="card">
      <div class="card-body">
          <div class="card-title">
              <h3>Chat Group</h3>
            <div id="online" class="card-body">
              <b>Online: </b>
              <span v-for="user in online">
                {{ user }} 
              </span>
            </div>
              <hr>
          </div>
          <div style="overflow-y: scroll; height:350px;" id="megadiv" class="card-body">
              <div v-for="(msg, index) in messages" :key="index">
                  <p><span class="font-weight-bold">{{ msg.user }} to {{msg.recipient}}: </span>{{ msg.message }}</p>
              </div>
          </div>
      </div>
      <div class="card-footer">
          <form @submit.prevent="sendMessage">
            <div class="gorm-group">
              <label for="recipient">Recipient:</label>
              <input type="text" v-model="recipient" class="form-control" placeholder="everyone">
            </div>
              <div class="gorm-group pb-3">
                  <label for="message">Message:</label>
                  <input type="text" v-model="message" class="form-control">
              </div>
              <button type="submit" class="btn btn-success">Send</button>
          </form>
      </div>
  </div>
</template>


<script>
import io from 'socket.io-client';

export default {
    data() {
        return {
            user: '',
            message: '',
            recipient: '',
            messages: [],
            online: [],
            socket : io('localhost:3001')
        }
    },
    methods: {
        sendMessage(e) {
            e.preventDefault();
            if(this.recipient == ""){
              this.recipient = "everyone"
            }
            this.socket.emit('SEND_MESSAGE', {
                user: this.user,
                message: this.message,
                recipient: this.recipient
            });
            this.message = ''
        }
    },
    mounted() {

        var user = prompt("Username:")
        this.user = user
        this.socket.emit('LOGIN', {
          user: user
        })

        this.socket.on('MESSAGE', (data) => {
            this.messages = [...this.messages, data];
          var elem = document.getElementById('megadiv');
          elem.scrollTop = elem.height;
        });
      this.socket.on('ONLINE', (data) => {
        this.online = data;
      });
    }
}
</script>

<style>
body{
  width: 100%;
  height: 100%;
}
</style>
