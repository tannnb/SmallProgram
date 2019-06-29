Component({
    properties: {
        sourceData: {
            type: Object,
            value: {}
        }
    },
    methods: {
        handleItem: function (e) {
            let myEventDetail = e.currentTarget.dataset.item
            this.triggerEvent('handleTapItem', myEventDetail, { bubbles: false })
        }
    }

})
