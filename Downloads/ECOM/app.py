from flask import Flask, request, jsonify, send_from_directory, session, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_marshmallow import Marshmallow
from flask_bcrypt import Bcrypt
from sqlalchemy import Column, Integer, String, Text
from os import environ
import os
from uuid import uuid4
from werkzeug.utils import secure_filename


app = Flask(__name__)


# Initialize extensions
db = SQLAlchemy(app)
ma = Marshmallow(app)
bcrypt = Bcrypt(app)
CORS(app, supports_credentials=True)

app.config['SECRET_KEY'] = 'cairocoders-ednalan'
app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('DB_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True
app.config['UPLOAD_FOLDER'] = os.path.join(os.getcwd(), 'uploads')


def get_uuid():
    return uuid4().hex

class User(db.Model):
    __tablename__ = "users"
    id = Column(String(32), primary_key=True, unique=True, default=get_uuid)
    email = Column(String(150), unique=True)
    password = Column(Text, nullable=False)
    purchases = db.relationship('Purchase', backref='user', lazy=True)
    cart_items = db.relationship('Product', secondary='cart', lazy='subquery',
                                 backref=db.backref('users', lazy=True))
    
 

    def json(self):
        purchase_details = []
        for purchase in self.purchases:
            purchase_details.append({
                'id': purchase.id,
                'product_name': purchase.product_name,
                'product_price': purchase.product_price,
                'quantity': purchase.quantity
            })
        return {
            'id': self.id,
            'email': self.email,
            'password': self.password,
            'purchases': purchase_details
        }



class Purchase(db.Model):
    __tablename__ = "purchases"
    id = Column(Integer, primary_key=True)
    user_id = Column(String(32), db.ForeignKey('users.id'), nullable=False)
    product_name = Column(String(255))
    product_price = Column(db.Float)
    quantity = Column(Integer, nullable=False, default=1)

    def json(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'product_name': self.product_name,
            'product_price': self.product_price,
            'quantity': self.quantity
        }



class Cart(db.Model):
    __tablename__ = "cart"
    user_id = Column(String(32), db.ForeignKey("users.id"), primary_key=True)
    product_id = Column(Integer, db.ForeignKey("products.id"), primary_key=True)
    quantity = Column(Integer, nullable=False, default=1)



class Product(db.Model):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True)
    productName = Column(String(255))
    price = Column(db.Float)
    description = Column(Text)
    productImage = Column(String(255))
    carts = db.relationship('Cart', backref='product', lazy=True)

    def json(self):
        return {
            "id": self.id,
            "productName": self.productName,
            "description": self.description,
            "price": self.price,
            "productImage": self.productImage
        }



db.create_all()


@app.route("/products", methods=["GET"])
def get_products():
    products = Product.query.all()
    return jsonify([product.json() for product in products])


@app.route("/products/<int:id>", methods=["GET"])
def get_product(id):
    product = Product.query.get(id)
    if product is None:
        return jsonify({"error": "Product not found"}), 404
    return jsonify(product.json())


@app.route("/products", methods=["POST"])
def add_product():
   # Check if the required fields are present
    if "productName" not in request.form or "price" not in request.form or "description" not in request.form:
        return jsonify({"error": "Missing required fields"}), 400

    product = Product(
        productName=request.form["productName"],
        price=float(request.form["price"]),
        description=request.form["description"],
        productImage=""
    )

    # Handle uploaded image file
    if "productImage" in request.files:
        file = request.files["productImage"]
        if file.filename != "":
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            product.productImage = filename

    db.session.add(product)
    db.session.commit()

    # # Update the user's cart items
    # user_id = request.form.get("user_id")  # Assuming the user ID is passed in the request
    # user = User.query.get(user_id)
    # user.cart_items.append(product)
    # db.session.commit()

    return jsonify({"message": "Product added to cart successfully"}), 201




@app.route("/cart/<user_id>", methods=["GET"])
def get_cart_items(user_id):
    user = User.query.get(user_id)
    if user is None:
        return jsonify({"error": "User not found"}), 404

    cart_items = []
    for cart_item in user.cart_items:
        product = cart_item.json()
        # Get the quantity for the current cart item
        quantity = Cart.query.filter_by(user_id=user_id, product_id=product['id']).first().quantity
        product['quantity'] = quantity
        cart_items.append(product)

    return jsonify({"cart_items": cart_items})


@app.route("/cart/<user_id>/clear", methods=["POST"])
def clear_cart(user_id):
    # Find the user
    user = User.query.get(user_id)
    if user is None:
        return jsonify({"error": "User not found"}), 404

    # Clear the user's cart items
    user.cart_items = []
    db.session.commit()

    return jsonify({"message": "Cart cleared successfully"})

@app.route("/cart/<user_id>", methods=["POST"])
def add_to_cart(user_id):
    # Find the user
    user = User.query.get(user_id)
    if user is None:
        return jsonify({"error": "User not found"}), 404

    data = request.json
    product_id = data.get("productId")
    quantity = data.get("quantity")

    # Find the product
    product = Product.query.get(product_id)
    if product is None:
        return jsonify({"error": "Product not found"}), 404

    # Check if the cart item already exists for the user and product
    cart_item = Cart.query.filter_by(user_id=user_id, product_id=product_id).first()
    if cart_item is not None:
        # Update the quantity of the existing cart item
        cart_item.quantity += quantity
    else:
        # Create a new cart item with the specified quantity
        cart_item = Cart(user_id=user_id, product_id=product_id, quantity=quantity)
        db.session.add(cart_item)

    db.session.commit()

    return jsonify({"message": "Product added to cart successfully"}), 201

@app.route("/cart/<user_id>/items/<product_id>", methods=["PUT"])
def update_cart_item_quantity(user_id, product_id):
    try:
        # Find the user
        user = User.query.get(user_id)
        if user is None:
            return jsonify({"error": "User not found"}), 404

        # Find the cart item
        cart_item = Cart.query.filter_by(user_id=user_id, product_id=product_id).first()
        if cart_item is None:
            return jsonify({"error": "Cart item not found"}), 404

        data = request.json
        new_quantity = data.get("quantity")

        # Update the quantity of the cart item
        cart_item.quantity = new_quantity
        db.session.commit()

        return jsonify({"message": "Cart item quantity updated successfully"})

    except Exception as e:
        return jsonify({"error": "Error updating cart item quantity"}), 500


@app.route("/cart/<user_id>/items/<product_id>", methods=["DELETE"])
def remove_cart_item(user_id,product_id):
    # Get the current user
    user = User.query.get(user_id)
    if not user:
        return jsonify(message="User not logged in"), 401
    
    # Check if the product exists in the user's cart
    cart_item = Cart.query.filter_by(user_id=user_id, product_id=product_id).first()
    if not cart_item:
        return jsonify(message="Product not found in cart"), 404
    
    # Remove the cart item from the database
    db.session.delete(cart_item)
    db.session.commit()
    
    return jsonify(message="Cart item removed successfully"), 200

@app.route("/cart/<user_id>/update", methods=["POST"])
def update_cart_item_count(user_id):
    try:
        # Find the user
        user = User.query.get(user_id)
        if user is None:
            return jsonify({"error": "User not found"}), 404

        data = request.json
        new_quantity = data.get("newQuantity")
        product_id = data.get("productId")

        # Find the cart item
        cart_item = Cart.query.filter_by(user_id=user_id, product_id=product_id).first()
        if cart_item is None:
            return jsonify({"error": "Cart item not found"}), 404

        # Update the quantity of the cart item
        cart_item.quantity = new_quantity
        db.session.commit()

        return jsonify({"message": "Cart item count updated successfully"})

    except Exception as e:
        return jsonify({"error": "Error updating cart item count"}), 500


@app.route("/products/<int:id>", methods=["DELETE"])
def remove_product(id):
    product = Product.query.get(id)
    if product is None:
        return jsonify({"error": "Product not found"}), 404

    # Remove the product from all users' carts
    users = User.query.filter(User.cart_items.any(id=product.id)).all()
    for user in users:
        user.cart_items.remove(product)

    db.session.delete(product)
    db.session.commit()

    return jsonify({"message": "Product removed successfully"})


@app.route("/products/<int:id>", methods=["PUT"])
def update_product(id):
    product = Product.query.get(id)
    if product is None:
        return jsonify({"error": "Product not found"}), 404

    data = request.json

    # Check if the required fields are present
    if "productName" not in data or "price" not in data or "description" not in data:
        return jsonify({"error": "Missing required fields"}), 400

    product.productName = data["productName"]
    product.price = float(data["price"])
    product.description = data["description"]

    db.session.commit()

    return jsonify({"message": "Product updated successfully"})


@app.route("/uploads/<filename>", methods=["GET"])
def get_uploaded_file(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)


@app.route("/checkout/<user_id>", methods=["POST"])
def checkout(user_id):
    # Find the user
    user = User.query.get(user_id)
    if user is None:
        return jsonify({"error": "User not found"}), 404

    # Add cart items to user's purchases
    for cart_item in user.cart_items:
        purchase = Purchase(
            user_id=user.id,
            product_name=cart_item.productName,
            product_price=cart_item.price
        )
        db.session.add(purchase)

    # Reset the user's cart items
    user.cart_items = []

    db.session.commit()

    return jsonify({"message": "Checkout successful"})


@app.route("/signup", methods=["POST"])
def signup():
    email = request.json["email"]
    password = request.json["password"]

    user_exists = User.query.filter_by(email=email).first() is not None

    if user_exists:
        return jsonify({"error": "Email already exists"}), 409

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    new_user = User(email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    session["user_id"] = new_user.id

    return jsonify({
        "id": new_user.id,
        "email": new_user.email
    })


@app.route("/login", methods=["POST"])
def login_user():
    email = request.json["email"]
    password = request.json["password"]

    user = User.query.filter_by(email=email).first()
    if user is None:
        return jsonify({"error": "Unauthorized Access"}), 401

    if not bcrypt.check_password_hash(user.password.encode('utf-8'), password.encode('utf-8')):
        return jsonify({"error": "Unauthorized"}), 401

    session["user_id"] = user.id

    return jsonify({
        "id": user.id,
        "email": user.email
    })


@app.route('/user/<id>', methods=['GET'])
def get_user(id):
    try:
        user = User.query.filter_by(id=str(id)).first()
        if user:
            return make_response(jsonify({'user': user.json()}), 200)
        return make_response(jsonify({'message': 'Person not found'}), 404)
    except Exception as e:
        return make_response(jsonify({'message': 'There was an error getting the person'}), 500)


@app.route('/purchases', methods=['POST'])
def create_purchase():
    data = request.get_json()
    user_id = data['userId']
    items = data['items']
    total_price = data['totalPrice']

    for item in items:
        product_name = item['productName']
        product_price = item['price']
        quantity = item['quantity']

        purchase = Purchase(
            user_id=user_id,
            product_name=product_name,
            product_price=product_price,
            quantity=quantity
        )
        db.session.add(purchase)

    db.session.commit()

    return jsonify(message='Purchase saved successfully'), 201


if __name__ == '__main__':
    app.run()
