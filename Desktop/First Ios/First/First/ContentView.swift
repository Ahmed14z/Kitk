//
//  ContentView.swift
//  First
//
//  Created by Ahmed Eslam on 08/06/2022.
//

import SwiftUI

struct ContentView: View {
    var body: some View {
        Text("Ahmed Eslam!")
            .font(.title2)
            .fontWeight(.black)
            .foregroundColor(Color.red)
            .lineLimit(0)
            .padding(0.0)

        
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
