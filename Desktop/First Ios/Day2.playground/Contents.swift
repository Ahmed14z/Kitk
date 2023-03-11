import UIKit
//ASSIGMENT 1
print("Assigment 1 \n")
class Movies{
    var title : String
    var image : String  
    var rating:Float
    var releaseDate:Int
    var genre: [String]
    
    
        init(title: String , image: String , rating: Float , releaseDate: Int , genre: [String]){
        
        self.title = title
        self.image = image
        self.rating = rating
        self.releaseDate = releaseDate
        self.genre = genre
        
    }
}

let mov1 = Movies(title: "Harry Potter" , image : "HP" , rating: 5 , releaseDate:2000 , genre:["Action" , "Fantasy"])

let mov2 = Movies(title: "Spider Man" , image : "SP" , rating: 5 , releaseDate:2002 , genre:["Action" , "Fantasy"])

let mov3 = Movies(title: "Iron Man" , image : "IM" , rating: 4 , releaseDate:2010 , genre:["Action" , "Fantasy" , "Drama"])

let mov4 = Movies(title: "Avengers" , image : "SP" , rating: 3 , releaseDate:2010 , genre:["Action" , "Fantasy"])

let mov5 = Movies(title: "Titanic" , image : "TC" , rating: 3 , releaseDate:1997 , genre:["Drama" , "Romance"])

print(mov1.title + "\n",mov2.title + "\n" , mov3.title + "\n",  mov4.title+"\n" , mov5.title )

print("------------------------")


//ASSIGMENT 2   MY TASK
print("Assigment 2 \n")


class Calc{
    var num1:Int
    var num2:Int
    
     init(num1:Int , num2:Int){
       self.num1 = num1
       self.num2 = num2

    }
    var plus :Int {
        get{
            return num1+num2
        }
        
    }
    var minus :Int {
        get{
            return num1-num2
        }
    }
    var div :Int {
        get{
            return num1/num2
        }
    }
    var mult :Int {
        get{
            return num1*num2
        }
    }
}
var obj1 = Calc(num1: 6, num2: 6)
print( obj1.plus)
print( obj1.minus)
print( obj1.mult)
print( obj1.div)
print("------------------------")

//Assigment 2 , 2nd option  and trying assigment 3
print("Assigment 2 , and trying assigment 3\n")


class Calclate {
    var num1 : Int
    var num2: Int
    var square: Int
    

    
    
    init(num1:Int , num2:Int,square:Int){
      self.num1 = num1
      self.num2 = num2
      self.square = square

   }
    
   

    
    func add() -> Int{
        return num1+num2
    }
    func min()-> Int{
       return num1-num2
    }
    func times()-> Int{
        return num1*num2
    }
    func divided()-> Int{
        return num1/num2
    }

}

var obj = Calclate(num1: 6, num2: 6,square: 6)  // Assigment 3 part ...... i couldn't initialize in the extension , i tried initializing in the main class in its own initializer  but still got an error , so i made it in the same initialization of num1 and num2.

print(obj.add())
print(obj.min())
print(obj.times())
print(obj.divided())
     
      
print("------------------------")

//Assigment 3

print("Assigment 3 \n")



extension Calclate {
 
    
   func ssquare() -> Int {

        return square*square
    }

}

// i couldn't initialize in the extension , i tried initializing in the main class in its own initializer  but still got an error , so i made it in the same initialization of num1 and num2.


var obj2 = Calclate(num1: 4, num2: 5, square: 6)
print(obj2.ssquare())


