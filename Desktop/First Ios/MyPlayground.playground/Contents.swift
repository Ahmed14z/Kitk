
let luckyNumbers = [7,4,38,21,16,15,12,33,31,49]

print(luckyNumbers.filter({!$0.isMultiple(of: 2) }))
let NewL=luckyNumbers.sorted()
print(NewL)

let x = luckyNumbers.filter({ !$0.isMultiple(of: 2) }).sorted().map{(String($0) + " is a lucky number")}
for i in 0..<x.count{
    print("\n\(x[i])")
}

