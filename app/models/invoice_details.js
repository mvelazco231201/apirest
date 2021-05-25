class invoice_details{
    constructor(invoice_id, product_id, quantity, cost){
        this.invoice_id=invoice_id;
        this.product_id=product_id;
        this.quantity=quantity;
        this.cost=cost;
    }
}
module.exports=invoice_details;