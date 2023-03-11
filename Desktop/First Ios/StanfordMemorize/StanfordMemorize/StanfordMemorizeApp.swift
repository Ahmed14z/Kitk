//
//  StanfordMemorizeApp.swift
//  StanfordMemorize
//
//  Created by Ahmed Eslam on 02/07/2022.
//

import SwiftUI

@main
struct StanfordMemorizeApp: App {
    let game = EmojiMemoryGame()
    
    var body: some Scene {
        WindowGroup {
            ContentView(viewModel: game)
        }
    }
}
