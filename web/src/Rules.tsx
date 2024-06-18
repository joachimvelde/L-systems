import React, { useState } from 'react'

interface Rule {
    id: number;
    value: string;
};

const Rules = () => {
    // Keep track of all rules
    const [rules, setRules] = useState<Rule[]>([]);

    const addRule = () => {
        setRules([...rules, { id: Date.now(), value: '' }]);
    };

    const updateRule = (id: number, value: string) => {
        const updatedRules = rules.map((rule) =>
            rule.id === id ? { ...rule, value: value } : rule
        );
        setRules(updatedRules);
    };
    
    return (
        <div className="rules-editor">
            <h2>Rules</h2>
            <div className="rules">
                <p>
                    Each rule should define a symbol and it's rule for expansion, separated by a space.
                    Example: F F+-F represents the expansion of F into F+-F.
                </p>
                {rules.map((rule) => (
                    <input
                        key={rule.id}
                        value={rule.value}
                        onChange={(e) => updateRule(rule.id, e.target.value)}
                        className="rule"
                        placeholder="Enter rule"
                    />
                ))}
            </div>
            <button onClick={addRule}>Add rule</button>
        </div>
    );
};

export default Rules;
