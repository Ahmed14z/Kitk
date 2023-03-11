import UIKit




func getFactorial (_ num:Int)-> Int{

    var res: Int = 1
    for index in 1...num{
        res *= index
        
    }
    return(res)
}

func calcPower(_ b:Int,_ p:Int)->Int{
    var res:Int = 1
    
    for _ in 1...p{
        
        res *= b
    }
    return res

}


func sortArray(_ array: [Int] ) -> [Int]{
    var arr = array
    let  n =  arr.count
    for i in  1..<n {
        var x = i
        while(x>0 && arr[x]<arr[x-1]){
            arr.swapAt(x - 1, x)
                        x -= 1
           
        }
       
        
        }
    return arr
       
        
    }
   



  

print(getFactorial(5))
print(calcPower(2,5))
print(sortArray([4,5,6,8,3,1]))

