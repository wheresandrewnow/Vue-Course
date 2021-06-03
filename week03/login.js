Vue.createApp({
    data() {  // 資料
        return {
            url: 'https://vue3-course-api.hexschool.io',
            username: '',
            password: '',
        }
    },
    mounted() { // 生命週期

    },
    methods: { // 方法
        login() {
            const user = {
                username: this.username,
                password: this.password,
            }
            // 登入
            axios.post(`${this.url}/admin/signin`, user)
            .then(res => {
                console.log(res.data);
                if(res.data.success) {
                    alert('登入成功');
                    this.username = '';
                    this.password = '';
                }else {
                    alert('輸入錯誤，請重新輸入');
                }
                const expired = res.data.expired;
                const token = res.data.token;
                console.log(expired, token)

                // 儲存 cookie
                document.cookie = `loginToken=${token}; expires=${new Date(expired)}`;

                // 跳頁
                window.location = `index.html`;
            })
            .catch(err => {
                console.log(err);
            })
        }

    },
}).mount('#app');
