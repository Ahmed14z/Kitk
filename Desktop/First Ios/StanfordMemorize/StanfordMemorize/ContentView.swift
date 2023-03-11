//
//  ContentView.swift
//  StanfordMemorize
//
//  Created by Ahmed Eslam on 02/07/2022.
//

import SwiftUI

struct ContentView: View {
   
//@State var emojis2 = ["🫡","🛼","🤸‍♀️","🏓","🛹","🪁","🎲","🎳","♟","🪘","🚴🏻‍♂️","🎧","🎖","🥁","🎮","🧩","🎭","🧗🏻‍♀️","🚙","🚅","✈️","🚨","🛞"]
//    
//@State var flags = ["🇧🇪","🇨🇳","🇹🇩","🇧🇬","🇦🇼","🇰🇭","🇬🇺","🇮🇴","🇰🇾","🇨🇮","🇨🇴","🇨🇨","🇹🇰","🇨🇭","🇧🇲","🇨🇦","🇪🇸","🇸🇴","🇸🇾"]
//  
//    
//  @State var food = ["🍅","🍏","🍐","🍎","🍊","🍋","🍌","🍍","🍉","🍇","🍓","🫐","🥝","🥑","🥦","🍕","🌮","🥗","🥫"]
    
    @ObservedObject var viewModel:EmojiMemoryGame
   
    
   var body: some View {
        
        VStack{
            Text("Memorize!")
                .font(.largeTitle)
                .fontWeight(.bold)
                .foregroundColor(Color.purple)
            ScrollView{
               LazyVGrid(columns: [GridItem(.adaptive(minimum: 70))]){
                
                   ForEach(viewModel.cards)  { card in
                    Cardview(card: card)
                           .aspectRatio(2/3,contentMode:.fit)
                           .onTapGesture {
                               viewModel.choose(card)
                           }
                }}
                .foregroundColor(Color.purple)

            }
            Spacer()
            
            HStack{
//              remove
               
//                Vehicle
//                Spacer()
//                theme2
//
//                Spacer()
//                theme3
//
//                add
            
           
        }
            .font(.largeTitle)
            .padding(.horizontal)

        }
  
        .padding(.horizontal)
        
//        RoundedRectangle(cornerRadius: 20)
//            .stroke(lineWidth: 3)
//            .padding(.horizontal).foregroundColor(/*@START_MENU_TOKEN@*/.orange/*@END_MENU_TOKEN@*/)
    }
//    var Vehicle: some View{
//        Button{
////            self.flags = emojis
//            emojis=emojis2
//            emojis2.shuffle()
//
//
//
//         }
//
//
//    label: {
//        VStack {
//            Image(systemName: "car").font(.largeTitle)
//
//        Text("Vehicles")
//            .font(.body)
//
//
//
//        }
//
//
//
//
//        }
//    }
//
//    var theme2: some View{
//        Button{
//
//
//            emojis=flags
//            flags.shuffle()
//
//
//
//         }
//
//
//    label: {
//        VStack{
//
//        Image(systemName: "questionmark.app").font(.largeTitle)
//        Text("Theme 2")
//            .font(.body)
//        }
//
//
//
//
//
//        }
//    }
//    var theme3: some View{
//        Button{
//
//            emojis=food
//
//            food.shuffle()
//
////            flags=food
//
//
//         }
//
//
//    label: {
//
//        VStack{
//        Image(systemName: "questionmark.app").font(.largeTitle)
//
//
//
//        Text("Theme 3")
//            .font(.body)
//
//
//        }
//
//
//
//        }
//    }
    
    
    
//    var remove: some View{
//        Button {
//            if emojicount > 1{
//                emojicount -= 1}
//        }
//          label: {
//           Image(systemName: "minus.circle")
//
//        }
//    }
//    var add: some View{
//        Button{
//            if emojicount<emojis.count
//            {
//                emojicount += 1
//
//            }
//
//        } label: {
//            Image(systemName: "plus.circle")
//        }
//    }
}


struct Cardview: View {
    
    let card: MemoryGame<String>.Card
    var body: some View{
        ZStack {
            let shape =  RoundedRectangle(cornerRadius: 30)
            if card.isFaceUp{
                shape.strokeBorder(lineWidth: 3)
                    
                Text(card.content)
                .font(.largeTitle)
            }else if card.isMatched {
                shape.opacity(0)
            }
            else {
               shape.fill()
                
            }
        }
      

    }
    struct ContentView_Previews: PreviewProvider {
        static var previews: some View {
            let game =  EmojiMemoryGame()
            ContentView(viewModel: game)
                .preferredColorScheme(.light)
                .previewInterfaceOrientation(.portrait)
            ContentView(viewModel: game)
                .preferredColorScheme(.dark)
                .previewInterfaceOrientation(.portraitUpsideDown)
        }
        
        }
}

