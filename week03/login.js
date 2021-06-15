let url = 'https://vue3-course-api.hexschool.io';

Vue.createApp({
    data() {  // 資料
        return {
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
            axios.post(`${url}/admin/signin`, user)
            .then(res => {
                console.log(res.data);
                if(res.data.success) {
                    alert('登入成功');
                    this.username = '';
                    this.password = '';

                    const { expired, token } = res.data;
                    console.log(expired, token)

                    // 儲存 cookie
                    document.cookie = `loginToken=${token}; expires=${new Date(expired)}`;

                    // 跳頁
                    window.location = `index.html`;
                }else {
                    alert('輸入錯誤，請重新輸入');
                }
            })
            .catch(err => {
                console.log(err);
            })
        }

    },
}).mount('#app');
