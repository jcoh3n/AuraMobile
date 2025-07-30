#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script pour nettoyer les fichiers JSON en supprimant les doublons
Supporte :
- gare.json : doublons basés sur le code UIC
- output.json : doublons basés sur le code INSEE
"""

import json
import sys
import argparse
from collections import OrderedDict

# Configuration des fichiers et leurs clés uniques
FILE_CONFIGS = {
    'gare.json': {
        'unique_key': 'Code UIC',
        'display_name_key': 'Nom Gare',
        'description': 'gares SNCF'
    },
    'output.json': {
        'unique_key': 'CODE INSEE',
        'display_name_key': 'COMMUNE',
        'description': 'communes françaises'
    }
}

def detect_file_type(filename):
    """Détecte le type de fichier basé sur son nom"""
    for file_type, config in FILE_CONFIGS.items():
        if file_type in filename.lower():
            return file_type, config
    return None, None

def clean_json_file(input_file, output_file=None, file_config=None):
    """
    Nettoie un fichier JSON en supprimant les doublons
    
    Args:
        input_file (str): Chemin vers le fichier original
        output_file (str): Chemin vers le fichier nettoyé (optionnel)
        file_config (dict): Configuration pour ce type de fichier
    """
    
    print(f"📖 Lecture du fichier {input_file}...")
    
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        print(f"❌ Erreur: Le fichier {input_file} n'existe pas.")
        return False
    except json.JSONDecodeError as e:
        print(f"❌ Erreur JSON: {e}")
        return False
    
    if not file_config:
        # Essayer de détecter automatiquement le type
        file_type, file_config = detect_file_type(input_file)
        if not file_config:
            print(f"❌ Type de fichier non reconnu: {input_file}")
            print("Types supportés: gare.json, output.json")
            return False
    
    unique_key = file_config['unique_key']
    display_name_key = file_config['display_name_key']
    description = file_config['description']
    
    print(f"📊 Nombre total de {description} avant nettoyage: {len(data)}")
    print(f"🔑 Clé unique utilisée: {unique_key}")
    
    # Dictionnaire pour stocker les éléments uniques
    elements_uniques = OrderedDict()
    doublons_trouves = []
    
    # Parcourir tous les éléments
    for element in data:
        unique_value = element.get(unique_key)
        display_name = element.get(display_name_key, 'N/A')
        
        if unique_value is None:
            print(f"⚠️  Élément sans {unique_key} trouvé: {display_name}")
            continue
            
        # Si la clé unique existe déjà, c'est un doublon
        if unique_value in elements_uniques:
            doublons_trouves.append({
                'unique_value': unique_value,
                'nom_original': elements_uniques[unique_value].get(display_name_key, 'N/A'),
                'nom_doublon': display_name
            })
        else:
            # Première occurrence, on la garde
            elements_uniques[unique_value] = element
    
    # Convertir le dictionnaire ordonné en liste
    data_nettoyee = list(elements_uniques.values())
    
    print(f"🧹 Nombre de doublons supprimés: {len(doublons_trouves)}")
    print(f"✅ Nombre de {description} après nettoyage: {len(data_nettoyee)}")
    
    # Afficher quelques exemples de doublons trouvés
    if doublons_trouves:
        print(f"\n🔍 Exemples de doublons supprimés:")
        for i, doublon in enumerate(doublons_trouves[:5]):  # Afficher les 5 premiers
            print(f"   • {unique_key} {doublon['unique_value']}: '{doublon['nom_original']}' (gardé) vs '{doublon['nom_doublon']}' (supprimé)")
        
        if len(doublons_trouves) > 5:
            print(f"   ... et {len(doublons_trouves) - 5} autres doublons")
    
    # Générer le nom de fichier de sortie si pas fourni
    if not output_file:
        if input_file.endswith('.json'):
            output_file = input_file.replace('.json', '_clean.json')
        else:
            output_file = f"{input_file}_clean"
    
    # Sauvegarder le fichier nettoyé
    print(f"\n💾 Sauvegarde du fichier nettoyé vers {output_file}...")
    
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(data_nettoyee, f, ensure_ascii=False, indent=4)
        
        print(f"✅ Fichier nettoyé sauvegardé avec succès!")
        print(f"📈 Réduction: {len(data) - len(data_nettoyee)} éléments supprimés ({((len(data) - len(data_nettoyee)) / len(data) * 100):.1f}%)")
        
        return True
        
    except Exception as e:
        print(f"❌ Erreur lors de la sauvegarde: {e}")
        return False

def main():
    """Fonction principale"""
    parser = argparse.ArgumentParser(description='Nettoie les fichiers JSON en supprimant les doublons')
    parser.add_argument('files', nargs='*', default=['public/gare.json', 'public/output.json'], 
                       help='Fichiers à nettoyer (par défaut: gare.json et output.json)')
    parser.add_argument('--all', action='store_true', 
                       help='Nettoie tous les fichiers supportés')
    
    args = parser.parse_args()
    
    print("🧹 Nettoyage des fichiers JSON - Suppression des doublons")
    print("=" * 60)
    
    files_to_clean = args.files
    if args.all:
        files_to_clean = ['public/gare.json', 'public/output.json']
    
    success_count = 0
    total_files = len(files_to_clean)
    
    for i, file_path in enumerate(files_to_clean, 1):
        print(f"\n📁 [{i}/{total_files}] Traitement de {file_path}")
        print("-" * 40)
        
        # Vérifier si le fichier existe
        try:
            with open(file_path, 'r') as f:
                pass
        except FileNotFoundError:
            print(f"⚠️  Fichier ignoré (non trouvé): {file_path}")
            continue
        
        # Nettoyer le fichier
        success = clean_json_file(file_path)
        if success:
            success_count += 1
    
    print(f"\n🎉 Nettoyage terminé!")
    print(f"✅ {success_count}/{total_files} fichiers traités avec succès")
    
    if success_count > 0:
        print("\n💡 Les fichiers originaux sont conservés.")
        print("💡 Les fichiers nettoyés ont le suffixe '_clean.json'.")
        print("\n📝 Pour remplacer les originaux par les versions nettoyées:")
        for file_path in files_to_clean:
            if file_path.endswith('.json'):
                clean_file = file_path.replace('.json', '_clean.json')
                print(f"   mv {clean_file} {file_path}")
    
    if success_count < total_files:
        sys.exit(1)

if __name__ == "__main__":
    main() 