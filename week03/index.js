let productModal = {};
let delProductModal = {};

Vue.createApp({
    data() { // 資料
        return {
            url: 'https://vue3-course-api.hexschool.io',
            path: 'wheresandrewnow',
            productList: [],
            tempProduct: {
                imagesUrl: [],
            },
        }
    },
    mounted() { // 生命週期
        // 取得 cookie
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)loginToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        // headers 帶 token
        axios.defaults.headers.common['Authorization'] = token;
        if(token === '') {
            alert('尚未登入，請重新登入');
            window.location = 'login.html';
        }

        // * bootstrap 開啟 Modal
        productModal = new bootstrap.Modal(document.getElementById('productModal'));
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'));
        
        this.getData();
    },
    methods: { // 方法
        // 取得資料
        getData() {
            axios.get(`${this.url}/api/${this.path}/admin/products`)
            .then(res => {
                console.log(res);
                if(res.data.success) {
                    this.productList = res.data.products;
                }else {
                    alert(res.data.message);
                }
            })
            .catch(err => {
                console.log(err);
            })
        },
        // 新增 & 更改資料
        addressData() {
            // 新增
            if(this.tempProduct.id === undefined) {
                const addProduct = {
                    data: this.tempProduct,
                }
                axios.post(`${this.url}/api/${this.path}/admin/product`, addProduct)
                .then(res => {
                    if(res.data.success) {
                        alert(res.data.message);
                        productModal.hide();
                        this.getData();
                    }else {
                        alert(res.data.message);
                    }
                })
                .catch(err => {
                    console.log(err);
                })
            }else { // 更改
                const id = this.tempProduct.id;
                const editProduct = {
                    data: this.tempProduct,
                }
                axios.put(`${this.url}/api/${this.path}/admin/product/${id}`, editProduct)
                .then(res => {
                    if(res.data.success) {
                        alert(res.data.message);
                        productModal.hide();
                        this.getData();
                    }else {
                        alert(res.data.message);
                    }
                })
                .catch(err => {
                    console.log(err);
                })
            }
        },
        // 刪除資料
        deleteData() {
            const id = this.tempProduct.id;
            axios.delete(`${this.url}/api/${this.path}/admin/product/${id}`)
            .then(res => {
                if(res.data.success) {
                    alert(res.data.message);
                    delProductModal.hide();
                    this.getData();
                }else {
                    alert(res.data.message);
                }
            })
            .catch(err => {
                console.log(err);
            })
        },
        // Modal
        openModal(type, item) {
            if(type === 'new') {
                this.tempProduct = {};
                productModal.show();

            }else if(type === 'edit') {
                this.tempProduct = {...item};
                productModal.show();
                
            }else if(type === 'delete') {
                this.tempProduct = {...item};
                delProductModal.show();
            }
        },
        // 建立圖庫
        createAlbum() {
            this.tempProduct.imagesUrl = [
                '',
            ]
        },
        // 新增圖片
        addCell() {
            this.tempProduct.imagesUrl.push('');
        },
        // 刪除圖片
        deleteCell(index) {
            this.tempProduct.imagesUrl.splice(index,1);
        },
    }
}).mount('#app');



