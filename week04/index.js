import pagination from './pagination.js';

let url = 'https://vue3-course-api.hexschool.io';
let path = 'wheresandrewnow';
let productModal = {};
let delProductModal = {};

Vue.createApp({
    data() { // 資料
        return {
            productList: [],
            tempProduct: {
                imagesUrl: [],
            },
            pagination: {},
        }
    },
    // 區域元件
    components: {
        pagination,
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
        getData(page = 1) { // 預設 page = 1
            axios.get(`${url}/api/${path}/admin/products?page=${page}`)
            .then(res => {
                console.log(res);
                if(res.data.success) {
                    this.productList = res.data.products;
                    this.pagination = res.data.pagination; // 取得分頁資訊
                }else {
                    alert(res.data.message);
                }
            })
            .catch(err => {
                console.log(err);
            })
        },
        // 新增 & 更改資料
        addressData(tempProduct) {
            let link, method;
            // 新增
            if(tempProduct.id == undefined) {
                method = 'post';
                link = `${url}/api/${path}/admin/product`;
            
            }else { // 更改
                const id = tempProduct.id;
                method = 'put';
                link = `${url}/api/${path}/admin/product/${id}`;
            }

            axios[method](link, {data: tempProduct})
            .then(res => {
                console.log(res);
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
        },
        // // 刪除資料
        // deleteData(tempProduct) {
        //     const id = tempProduct.id;
        //     axios.delete(`${url}/api/${path}/admin/product/${id}`)
        //     .then(res => {
        //         if(res.data.success) {
        //             alert(res.data.message);
        //             delProductModal.hide();
        //             this.getData();
        //         }else {
        //             alert(res.data.message);
        //         }
        //     })
        //     .catch(err => {
        //         console.log(err);
        //     })
        // },
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

    }
})
.component('productModal', {
    props: ['tempProduct'], // 外層內容都已使用tempProduct
    template: `
    <div id="productModal" ref="productModal" class="modal fade" tabindex="-1" aria-labelledby="productModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-xl">
        <div class="modal-content border-0">
            <div class="modal-header bg-dark text-white">
            <h5 id="productModalLabel" class="modal-title">
                <span v-if="tempProduct.id === undefined">新增產品</span>
                <span v-else>編輯產品</span>
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="row">
                <div class="col-sm-4">
                    <div class="mb-1">
                    <div class="form-group">
                        <label for="imageUrl">主圖片</label>
                        <input id="imageUrl" type="text" class="form-control"
                            placeholder="請輸入主圖片連結" v-model="tempProduct.imageUrl">
                        <img class="img-fluid" :src="tempProduct.imageUrl" alt="">
                    
                        <template v-if="Array.isArray(tempProduct.imagesUrl)">
                        <label for="imagesUrl">圖庫</label>
                        <div v-for="(item, index) in tempProduct.imagesUrl" :key="index">
                        <input id="imagesUrl" type="text" class="form-control"
                        placeholder="請輸入圖片連結" v-model="tempProduct.imagesUrl[index]">
                            <img class="img-fluid" :src="tempProduct.imagesUrl[index]" alt="">
                        </div>
                        <div>
                            <button type="button" class="btn btn-outline-primary btn-sm d-block w-100"
                            @click="tempProduct.imagesUrl.push('')">
                                新增欄位
                            </button>
                        </div>
                        <div v-if="tempProduct.imagesUrl.length > 0">
                            <button type="button" class="btn btn-outline-danger btn-sm d-block w-100"
                            @click="tempProduct.imagesUrl.pop()">
                                刪除欄位
                            </button>
                        </div>
                        </template>

                        <template v-else>
                        <button type="button" class="btn btn-outline-primary btn-sm d-block w-100" @click="createAlbum">
                            建立圖庫
                        </button>
                        </template>
                    </div>
                    </div>
                </div>

            <div class="col-sm-8">
                <div class="form-group">
                    <label for="title">標題</label>
                    <input id="title" type="text" class="form-control" placeholder="請輸入標題" v-model="tempProduct.title">
                </div>

                <div class="row">
                    <div class="form-group col-md-6">
                    <label for="category">分類</label>
                    <input id="category" type="text" class="form-control"
                            placeholder="請輸入分類" v-model="tempProduct.category">
                    </div>
                    <div class="form-group col-md-6">
                    <label for="unit">單位</label>
                    <input id="unit" type="text" class="form-control" placeholder="請輸入單位" v-model="tempProduct.unit">
                    </div>
                </div>

                <div class="row">
                    <div class="form-group col-md-6">
                    <label for="origin_price">原價</label>
                    <input id="origin_price" type="number" min="0" class="form-control" placeholder="請輸入原價"
                    v-model.number="tempProduct.origin_price">
                    </div>
                    <div class="form-group col-md-6">
                    <label for="price">售價</label>
                    <input id="price" type="number" min="0" class="form-control"
                            placeholder="請輸入售價"
                            v-model.number="tempProduct.price">
                    </div>
                </div>
                <hr>

                <div class="form-group">
                    <label for="description">產品描述</label>
                    <textarea id="description" type="text" class="form-control"
                            placeholder="請輸入產品描述"
                            v-model="tempProduct.description">
                    </textarea>
                </div>
                <div class="form-group">
                    <label for="content">說明內容</label>
                    <textarea id="content" type="text" class="form-control"
                            placeholder="請輸入說明內容"
                            v-model="tempProduct.content">
                    </textarea>
                </div>
                <div class="form-group">
                    <div class="form-check">
                    <input id="is_enabled" class="form-check-input" type="checkbox"
                    v-model="tempProduct.is_enabled"
                            :true-value="1" :false-value="0">
                    <label for="is_enabled" class="form-check-label">是否啟用</label>
                    </div>
                </div>
                </div>
            </div>
            </div>
            <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                取消
            </button>
            <button type="button" class="btn btn-primary" @click="$emit('address-data', tempProduct)">
                確認
            </button>
            </div>
        </div>
        </div>
    </div>`,
    methods: {
        // 建立圖庫
        createAlbum() {
            this.tempProduct.imagesUrl = [''];
        },
    }
})
.mount('#app');



