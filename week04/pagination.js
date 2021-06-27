export default {
    props: ['page'],
    // :class="{ 'disabled': !page.has_pre(false) }" 使前一頁disabled
    // :class="{ 'active': item === page.current_page }" 使當前頁碼 acitive
    // @click="$emit('get-page', page.current_page -1) emit 往前一頁
    template: `
        <nav aria-label="Page navigation example">
    <ul class="pagination">
        <li class="page-item"
        :class="{ 'disabled': !page.has_pre }">
        <a class="page-link" href="#" aria-label="Previous"
        @click="$emit('get-page', page.current_page -1)">
            <span aria-hidden="true">&laquo;</span>
        </a>
        </li>

        <li class="page-item" v-for="item in page.total_pages"
        :class="{ 'active': item === page.current_page }"><a class="page-link" href="#"
        @click="$emit('get-page', item)">{{ item }}</a></li>

        <li class="page-item"
        :class="{ 'disabled': !page.has_next }">
        <a class="page-link" href="#" aria-label="Next"
        @click="$emit('get-page', page.current_page +1)">
            <span aria-hidden="true">&raquo;</span>
        </a>
        </li>
    </ul>
    </nav>`,
    created() {
        // console.log(this.page)
    }
}